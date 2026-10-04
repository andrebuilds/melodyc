import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { TERMS_VERSION } from "~/lib/legal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { env } from "~/env";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "~/lib/email";
import { SIGN_UP_CREDITS } from "~/lib/credits";
import { avatarKey, createS3Client, deleteSongFiles } from "~/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const acceptance = user as typeof user & {
            acceptedTerms?: boolean;
            acceptedClauses?: boolean;
          };
          if (!acceptance.acceptedTerms || !acceptance.acceptedClauses) {
            throw new APIError("BAD_REQUEST", {
              message:
                "You must accept the Terms, the Privacy Policy, and the specific clauses to create an account.",
            });
          }

          return {
            data: {
              ...user,
              credits: SIGN_UP_CREDITS,
              termsAcceptedAt: new Date(),
              termsVersion: TERMS_VERSION,
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      acceptedTerms: { type: "boolean", required: true, input: true },
      acceptedClauses: { type: "boolean", required: true, input: true },
    },
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
});
