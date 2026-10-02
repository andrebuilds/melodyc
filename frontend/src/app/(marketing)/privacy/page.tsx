import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "~/components/seo/json-ld";
import { breadcrumbStructuredData } from "~/lib/structured-data";
import { pageMetadata } from "~/lib/site-metadata";
import {
  LegalContent,
  LegalControllerCard,
  LegalExternalLink as ExternalLink,
  LegalList,
  LegalMail as Mail,
  LegalPageHero,
  LegalSection,
  LegalSubheading,
  LegalTable,
  legalLinkClass,
  legalStrongClass,
} from "~/components/legal/legal-layout";
import { PRIVACY_POLICY_UPDATED_AT, legalEntity } from "~/lib/legal";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Melodyc collects, uses, and protects your personal data, and how to exercise your rights under the GDPR.",
  path: "/privacy",
});

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className={legalStrongClass}>{children}</strong>;
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <JsonLd data={breadcrumbStructuredData("Privacy Policy", "/privacy")} />
      <LegalPageHero
        title="Privacy Policy"
        updatedAt={PRIVACY_POLICY_UPDATED_AT}
      />

      <LegalContent>
        <LegalControllerCard index={1} />

        <LegalSection title="1. Introduction" index={2}>
          <p>
            Welcome to <Strong>Melodyc</Strong> (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;). This Privacy Policy explains
            how <Strong>{legalEntity.name}</Strong> collects, uses, shares, and
            protects your personal data when you visit{" "}
            <Strong>{legalEntity.website}</Strong> and use the Melodyc AI music
            generation platform, including the free public demo (together, the
            &quot;Service&quot;).
          </p>
          <p>
            This policy is provided pursuant to Articles 13 and 14 of the EU
            General Data Protection Regulation (GDPR, Regulation (EU)
            2016/679) and complies with the Italian Privacy Code (Legislative
            Decree 196/2003, as amended by Legislative Decree 101/2018) and
            the decisions of the Italian Data Protection Authority (Garante
            per la protezione dei dati personali).
          </p>
        </LegalSection>

        <LegalSection title="2. Data Controller" index={3}>
          <p>
            The data controller is <Strong>{legalEntity.name}</Strong>, whose
            details are listed above. You can contact us about anything
            related to your personal data at{" "}
            <Mail address={legalEntity.privacyEmail} /> or by certified email
            (PEC) at <Mail address={legalEntity.pec} />.
          </p>
          {/* TODO: confirm with counsel that a DPO is not required (Art. 37 GDPR); if one is appointed, add their contact here. */}
          <p>
            We have not appointed a Data Protection Officer (DPO), as this is
            not required under Article 37 GDPR for our processing activities.
          </p>
          {/* TODO: shown automatically once legalEntity.parentCompany is set to D'Ambrosio Holding S.r.l. */}
          {legalEntity.parentCompany && (
            <p>
              {legalEntity.name} is subject to the direction and coordination
              of <Strong>{legalEntity.parentCompany}</Strong> pursuant to
              Article 2497-bis of the Italian Civil Code.{" "}
              {legalEntity.parentCompany} does not operate the Service and does
              not process the personal data of its users.
            </p>
          )}
        </LegalSection>

        <LegalSection title="3. Information We Collect" index={4}>
          <p>
            We collect the personal data you provide to us and some data that
            is generated automatically when you use the Service. We only
            collect what is needed for the purposes described in this policy.
          </p>

          <LegalSubheading>3.1 Information You Provide</LegalSubheading>
          <LegalList>
            <li>
              <Strong>Account information:</Strong> name, email address, and
              password when you register. Passwords are never stored in plain
              text: only a secure cryptographic hash is kept. You may also
              choose a public username and upload a profile picture from your
              account settings. Profile pictures are cropped, resized, and
              stored in our private cloud storage.
            </li>
            <li>
              <Strong>Creative content:</Strong> the song descriptions,
              prompts, lyrics, style tags, titles, and generation settings
              you submit, and the songs and cover images generated from them.
            </li>
            <li>
              <Strong>Published content and public profile:</Strong> when you
              choose to publish a song, its title, audio, cover image,
              categories, and your name, username, and profile picture become
              visible to other signed-in Melodyc users in Discover, in the
              player, and on your public profile page (/user/your-username),
              which lists your published songs. The generation prompt may be
              used to make the song searchable. You can unpublish a song,
              change your username, or remove your profile picture at any
              time.
            </li>
            <li>
              <Strong>Free demo prompts:</Strong> the description and options
              you submit when using the public demo without an account.
            </li>
            <li>
              <Strong>Payment data:</Strong> purchases and subscriptions are
              handled by Polar, which acts as Merchant of Record. We{" "}
              <Strong>never receive or store your card details</Strong>. We
              only receive the information needed to add credits to your
              account, such as the purchased product and the related customer
              identifier.
            </li>
            <li>
              <Strong>Communications:</Strong> the content of the emails you
              send us, for example to request support or exercise your rights.
            </li>
            <li>
              <Strong>Cookie preferences:</Strong> your consent choices, as
              described in our{" "}
              <Link href="/cookies" className={legalLinkClass}>
                Cookie Policy
              </Link>
              .
            </li>
          </LegalList>

          <LegalSubheading>3.2 Information Collected Automatically</LegalSubheading>
          <LegalList>
            <li>
              <Strong>Session data:</Strong> session identifiers, sign-in time,
              IP address, and browser user agent associated with your active
              sessions, used to keep you signed in and protect your account.
            </li>
            <li>
              <Strong>Usage data:</Strong> your credit balance, the likes you
              give, the creators you follow and who follows you, the
              listen count of published songs, and the in-app notifications
              generated by this activity (for example, who liked your song or
              started following you).
            </li>
            <li>
              <Strong>Demo abuse prevention:</Strong> to limit the free demo to
              one generation per visitor per day, we compute a one-way
              cryptographic hash of your IP address and browser user agent
              combined with the current date. We do not store your IP address
              in clear text for this purpose.
            </li>
            <li>
              <Strong>Technical logs:</Strong> our hosting provider
              automatically records technical information about requests (such
              as IP address, date and time, requested page, and browser type)
              to deliver the Service and keep it secure.
            </li>
            <li>
              <Strong>Analytics:</Strong> Melodyc does not currently use
              analytics or tracking tools. If we introduce them, they will be
              activated only with your consent.
            </li>
          </LegalList>

          <LegalSubheading>3.3 AI-Processed Data</LegalSubheading>
          <LegalList>
            <li>
              <Strong>Music generation:</Strong> your prompts and lyrics are
              processed by open-source AI models (ACE-Step for music, Qwen2 for
              lyrics, style tags, titles, categories, and cover art
              descriptions, and FLUX.1-schnell for cover
              images) that we run on our own dedicated GPU infrastructure
              hosted by Modal.
            </li>
            <li>
              <Strong>No third-party AI providers:</Strong> your content is not
              sent to external AI services such as OpenAI or Google, and we do
              not use your prompts, lyrics, or songs to train AI models.
            </li>
            <li>
              <Strong>Prompt cache:</Strong> to reduce generation time, the
              text produced by the language model for a given prompt may be
              temporarily cached on the same GPU infrastructure. The cache does
              not contain your name, email, or account identifier.
            </li>
          </LegalList>
        </LegalSection>

        <LegalSection title="4. How We Use Your Information" index={5}>
          <LegalList>
            <li>
              <Strong>Service delivery:</Strong> to create and manage your
              account, generate songs, titles, and cover images, store your
              library, provide downloads in multiple audio formats, show your
              public profile, and let you publish and discover music.
            </li>
            <li>
              <Strong>Free demo:</Strong> to generate a demo song without an
              account and prevent abuse of the free quota.
            </li>
            <li>
              <Strong>Payments and credits:</Strong> to sell subscriptions
              through Polar and add the purchased credits to your account.
            </li>
            <li>
              <Strong>Account emails:</Strong> to verify your email address,
              welcome you once your account is confirmed, reset your password,
              and send service notifications (song ready,
              generation failed, payment confirmed). You can turn notification
              emails on or off in your notification settings or with the unsubscribe
              link in every notification. Verification and password reset
              emails cannot be disabled because they are required for account
              security.
            </li>
            <li>
              <Strong>Security:</Strong> to authenticate you, protect accounts
              from unauthorized access, prevent fraud and abuse, and keep the
              Service available.
            </li>
            <li>
              <Strong>Support:</Strong> to answer your questions and requests.
            </li>
            <li>
              <Strong>Legal compliance:</Strong> to meet our legal, tax, and
              accounting obligations and to establish, exercise, or defend
              legal claims.
            </li>
          </LegalList>
          <p className="mt-3">
            We do not sell your personal data, we do not use it for
            advertising, and we do not perform profiling.
          </p>
        </LegalSection>

        <LegalSection title="5. Legal Bases for Processing (Art. 6 GDPR)" index={6}>
          <LegalTable
            headers={["Processing activity", "Legal basis"]}
            rows={[
              [
                "Account creation and management",
                "Contract performance (Art. 6(1)(b))",
              ],
              [
                "Song, lyrics, and cover generation, library, and publishing",
                "Contract performance (Art. 6(1)(b))",
              ],
              [
                "Payments, subscriptions, and credits via Polar",
                "Contract performance (Art. 6(1)(b))",
              ],
              [
                "Email verification, password reset, and service notification emails",
                "Contract performance (Art. 6(1)(b))",
              ],
              [
                "Free public demo and its daily limit",
                "Legitimate interest in offering a free trial and preventing abuse (Art. 6(1)(f))",
              ],
              [
                "Account security, session management, and technical logs",
                "Legitimate interest in keeping the Service secure (Art. 6(1)(f))",
              ],
              [
                "Support requests",
                "Contract performance (Art. 6(1)(b)) / Legitimate interest (Art. 6(1)(f))",
              ],
              [
                "Cookie consent records",
                "Legal obligation (Art. 6(1)(c))",
              ],
              [
                "Analytics and marketing cookies, if introduced",
                "Consent (Art. 6(1)(a))",
              ],
              [
                "Compliance with tax and legal obligations",
                "Legal obligation (Art. 6(1)(c))",
              ],
            ]}
          />
          <p>
            Where we rely on legitimate interest, we have balanced it against
            your rights and freedoms. You can object to this processing at any
            time as described in Section 11.
          </p>
        </LegalSection>

        <LegalSection title="6. Is Providing Your Data Mandatory?" index={7}>
          <p>
            Providing your name, email address, and password is necessary to
            create an account: without them we cannot provide the Service.
            Your prompts and lyrics are necessary to generate music. All other
            data is optional, and refusing optional cookies never limits your
            use of the Service.
          </p>
        </LegalSection>

        <LegalSection title="7. Recipients and Data Processors" index={8}>
          <p>
            We share personal data only with the providers needed to run the
            Service. Unless stated otherwise, they act as data processors on
            our behalf under a data processing agreement pursuant to Article
            28 GDPR and may only use the data to provide their services to us.
          </p>

          <LegalSubheading>Hosting and Infrastructure</LegalSubheading>
          <LegalTable
            headers={["Service", "Purpose", "Data location"]}
            rows={[
              [
                "Vercel",
                "Web application hosting, serverless functions, and technical logs",
                "Global CDN, United States (DPF)",
              ],
              [
                "Neon (PostgreSQL)",
                "Primary database: accounts, sessions, songs metadata, credits, likes, and consent records",
                "EU (Frankfurt)",
              ],
              [
                "Amazon Web Services (S3)",
                "Storage of generated audio files, cover images, and profile pictures",
                "EU (Stockholm)",
              ],
              [
                "Modal",
                "GPU infrastructure that runs the AI models for music, lyrics, and cover generation",
                "United States (SCC)",
              ],
              [
                "Inngest",
                "Background job orchestration for song generation",
                "United States (SCC)",
              ],
              [
                "Resend",
                "Delivery of account emails: email verification, password reset, and service notifications",
                "EU (Ireland) sending region, United States (SCC)",
              ],
            ]}
          />

          <LegalSubheading>Payments</LegalSubheading>
          <LegalList>
            <li>
              <Strong>Polar:</Strong> acts as Merchant of Record and{" "}
              <Strong>independent data controller</Strong> for checkout,
              subscriptions, invoicing, and tax compliance. When you register,
              we create a Polar customer profile with your name, email address,
              and Melodyc account identifier so you can purchase plans. Payment
              details are entered directly on Polar&apos;s checkout. See{" "}
              <ExternalLink href="https://polar.sh/legal/privacy">
                Polar&apos;s Privacy Policy
              </ExternalLink>
              .
            </li>
          </LegalList>

          <LegalSubheading>Other Recipients</LegalSubheading>
          <LegalList>
            <li>
              <Strong>Other Melodyc users:</Strong> your name, username,
              profile picture, your follower and following lists and counts,
              and only the songs you decide to publish, as described in
              Section 3.1. When you follow someone, they may receive an email
              with your name and a link to your profile.
            </li>
            <li>
              <Strong>GitHub:</Strong> serves the profile pictures of the
              project contributors shown in the footer as an independent
              controller, and may receive your IP address when your browser
              loads them.
            </li>
            <li>
              <Strong>Authorities:</Strong> public authorities, when required
              by law or by a binding order.
            </li>
            <li>
              <Strong>Professional advisors:</Strong> accountants, auditors,
              and lawyers bound by confidentiality, when necessary.
            </li>
          </LegalList>
        </LegalSection>

        <LegalSection title="8. International Data Transfers" index={9}>
          <p>
            Some of our providers are located outside the European Economic
            Area (EEA). When personal data is transferred outside the EEA, we
            ensure appropriate safeguards pursuant to Chapter V GDPR:
          </p>
          <LegalList>
            <li>
              <Strong>EU-US Data Privacy Framework (DPF):</Strong> for US
              providers certified under the DPF, based on the adequacy decision
              of the European Commission (Art. 45 GDPR).
            </li>
            <li>
              <Strong>Standard Contractual Clauses (SCC):</Strong> approved by
              the European Commission, for the other providers (Art. 46(2)(c)
              GDPR).
            </li>
            <li>
              <Strong>EU storage:</Strong> wherever possible we keep data in
              the EU. Our database is hosted in Frankfurt and generated audio
              is stored in Stockholm.
            </li>
          </LegalList>
          <p className="mt-3">
            You can request a copy of the safeguards adopted by contacting us.
          </p>
        </LegalSection>

        <LegalSection title="9. Data Retention" index={10}>
          <p>
            We keep personal data only for as long as necessary for the
            purposes described in this policy:
          </p>
          <LegalTable
            headers={["Data type", "Retention period"]}
            rows={[
              ["Account data", "Until you delete your account"],
              [
                "Songs, prompts, lyrics, and cover images",
                "Until you delete the song or your account",
              ],
              [
                "Username and profile picture",
                "Until you change or remove them, or delete your account",
              ],
              [
                "In-app notifications",
                "Shown for 90 days; deleted with your account or the related song",
              ],
              [
                "Email notification preferences",
                "Until you delete your account",
              ],
              [
                "Email delivery logs",
                "According to our email provider's log retention",
              ],
              [
                "Active sessions",
                "7 days from the last activity, or until you sign out",
              ],
              [
                "Free demo prompts and generated audio",
                "Up to 30 days from generation",
              ],
              ["Demo daily limit hash", "Up to 30 days"],
              [
                "Cookie consent records",
                "12 months from your choice",
              ],
              [
                "Support emails",
                "Up to 24 months after the request is closed",
              ],
              [
                "Technical logs",
                "According to our hosting provider's log retention, normally a few days",
              ],
              [
                "Records required by tax and accounting law",
                "10 years (Art. 2220 of the Italian Civil Code)",
              ],
            ]}
          />
          <p>
            After these periods, data is deleted or irreversibly anonymized,
            unless we need to keep it longer to comply with a legal obligation
            or to defend a legal claim.
          </p>
        </LegalSection>

        <LegalSection title="10. Data Security" index={11}>
          <p>
            We adopt appropriate technical and organizational measures
            (Art. 32 GDPR) to protect your personal data, including:
          </p>
          <LegalList>
            <li>
              <Strong>Encryption:</Strong> all traffic is encrypted with
              HTTPS/TLS, passwords are stored only as secure hashes, and secrets
              are kept in encrypted environment variables.
            </li>
            <li>
              <Strong>Authentication:</Strong> secure, HTTP-only session
              cookies with limited duration and rate limiting on authentication
              endpoints.
            </li>
            <li>
              <Strong>Access control:</Strong> each user can access only their
              own private songs. Database queries go through the Prisma ORM to
              prevent SQL injection.
            </li>
            <li>
              <Strong>Storage:</Strong> audio files and cover images are kept
              in a private storage bucket and served through short-lived signed
              links.
            </li>
            <li>
              <Strong>Infrastructure:</Strong> AI models run in isolated GPU
              environments, and access to production systems is restricted to
              authorized personnel.
            </li>
          </LegalList>
          <p className="mt-3">
            No method of transmission or storage is completely secure. If a
            personal data breach is likely to result in a risk to your rights,
            we will notify the Garante within 72 hours and, where required,
            inform you without undue delay (Articles 33 and 34 GDPR).
          </p>
        </LegalSection>

        <LegalSection title="11. Your Rights Under the GDPR" index={12}>
          <p>You have the following rights regarding your personal data:</p>
          <LegalList>
            <li>
              <Strong>Right of access</Strong> (Art. 15): obtain confirmation
              of whether we process your data and receive a copy of it.
            </li>
            <li>
              <Strong>Right to rectification</Strong> (Art. 16): correct
              inaccurate or incomplete data.
            </li>
            <li>
              <Strong>Right to erasure</Strong> (Art. 17): request the deletion
              of your data. You can delete your account yourself at any time
              from Account &gt; Security: this permanently removes your
              profile, songs, audio files, cover images, and preferences, and
              deletes your customer profile on Polar, except for the records
              Polar must keep for tax and accounting purposes.
            </li>
            <li>
              <Strong>Right to restriction of processing</Strong> (Art. 18):
              limit the processing in certain circumstances.
            </li>
            <li>
              <Strong>Right to data portability</Strong> (Art. 20): receive the
              data you provided in a structured, commonly used, and
              machine-readable format.
            </li>
            <li>
              <Strong>Right to object</Strong> (Art. 21): object at any time to
              processing based on legitimate interest, on grounds relating to
              your particular situation.
            </li>
            <li>
              <Strong>Right to withdraw consent</Strong> (Art. 7(3)): at any
              time, without affecting the lawfulness of prior processing.
            </li>
            <li>
              <Strong>Right to lodge a complaint</Strong> (Art. 77): with the
              Italian Data Protection Authority at{" "}
              <ExternalLink href="https://www.garanteprivacy.it">
                www.garanteprivacy.it
              </ExternalLink>
              , or with the supervisory authority of the EU Member State where
              you live, work, or where the alleged infringement took place.
            </li>
          </LegalList>
          <p className="mt-3">
            To exercise your rights, write to{" "}
            <Mail address={legalEntity.privacyEmail} />. Requests are free of
            charge. We will reply without undue delay and in any case within
            one month of receipt, a period that may be extended by two further
            months for complex requests, in which case we will inform you
            (Art. 12(3) GDPR). We may ask you to verify your identity before
            fulfilling your request.
          </p>
        </LegalSection>

        <LegalSection title="12. Children's Privacy" index={13}>
          <p>
            The Service is not directed to individuals under the age of 16,
            and we do not knowingly collect their personal data. If we learn
            that we have collected data from a child under 16 without valid
            parental authorization, we will delete it promptly. If you believe
            this has happened, please contact us.
          </p>
        </LegalSection>

        <LegalSection title="13. Automated Decision-Making" index={14}>
          <p>
            Melodyc uses AI to generate music, lyrics, style tags, categories,
            and cover images from your input. This processing only provides
            the creative service you request: it is{" "}
            <Strong>not used for profiling</Strong> and does not produce
            decisions with legal or similarly significant effects on you
            (Art. 22 GDPR). You always decide which songs to keep, publish, or
            unpublish.
          </p>
        </LegalSection>

        <LegalSection title="14. Cookies" index={15}>
          <p>
            For detailed information about the cookies and similar
            technologies we use and how to manage your preferences, see our{" "}
            <Link href="/cookies" className={legalLinkClass}>
              Cookie Policy
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="15. Changes to This Policy" index={16}>
          <p>
            We may update this Privacy Policy to reflect changes in our
            practices, technology, or legal requirements. We will publish the
            updated version on this page and change the &quot;Last
            updated&quot; date. In case of material changes, we will inform
            you through the Service or by email before they take effect.
          </p>
        </LegalSection>

        <LegalSection title="16. Contact Us" index={17}>
          <p>
            For any questions about this Privacy Policy or to exercise your
            rights, contact us:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              Email: <Mail address={legalEntity.privacyEmail} />
            </li>
            <li>
              PEC: <Mail address={legalEntity.pec} />
            </li>
            <li>
              Address: {legalEntity.address}, {legalEntity.city}
            </li>
          </ul>
        </LegalSection>
      </LegalContent>
    </div>
  );
}
