import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import {
  polar,
  checkout,
  portal,
  webhooks,
} from "@polar-sh/better-auth";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "~/lib/email";
import { notifyPaymentConfirmed } from "~/lib/notifications";
import { avatarKey, createS3Client, deleteSongFiles } from "~/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            credits: 20,
          },
        }),
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      // Database rows (songs, likes, sessions, preferences) are removed by cascade after this.
      beforeDelete: async (user) => {
        const songs = await db.song.findMany({
          where: { userId: user.id },
          select: { s3Key: true, thumbnailS3Key: true },
        });
        try {
          await deleteSongFiles(songs);
          await createS3Client().send(
            new DeleteObjectCommand({
              Bucket: env.S3_BUCKET_NAME,
              Key: avatarKey(user.id),
            }),
          );
        } catch (error) {
          console.error(`S3 cleanup failed for deleted user ${user.id}`, error);
        }

        try {
          // Also cancels active subscriptions on Polar.
          await polarClient.customers.deleteExternal({ externalId: user.id });
        } catch (error) {
          console.error(`Polar customer deletion failed for user ${user.id}`, error);
        }
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url);
    },
    onEmailVerification: async (user) => {
      try {
        await sendWelcomeEmail(user.email, user.name);
      } catch (error) {
        console.error("Welcome email failed", error);
      }
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: env.POLAR_TRACK_PRODUCT_ID,
              slug: "track",
            },
            {
              productId: env.POLAR_EP_PRODUCT_ID,
              slug: "ep",
            },
            {
              productId: env.POLAR_DISCOGRAPHY_PRODUCT_ID,
              slug: "discography",
            },
          ],
          successUrl: "/billing?payment=success",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case env.POLAR_TRACK_PRODUCT_ID:
                creditsToAdd = 30;
                break;
              case env.POLAR_EP_PRODUCT_ID:
                creditsToAdd = 70;
                break;
              case env.POLAR_DISCOGRAPHY_PRODUCT_ID:
                creditsToAdd = 150;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });

            try {
              await notifyPaymentConfirmed(externalCustomerId, creditsToAdd);
            } catch (error) {
              // Credits are already added; an email failure must not make Polar retry the webhook.
              console.error("Payment confirmation email failed", error);
            }
          },
        }),
      ],
    }),
  ],
});
