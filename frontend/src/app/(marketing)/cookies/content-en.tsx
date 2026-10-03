import Link from "next/link";
import {
  LegalControllerCard,
  LegalExternalLink as ExternalLink,
  LegalList,
  LegalMail as Mail,
  LegalSection,
  LegalTable,
  legalLinkClass,
  legalStrongClass,
} from "~/components/legal/legal-layout";
import { legalEntity } from "~/lib/legal";

export function CookieContentEn() {
  return (
    <>
      <LegalControllerCard index={1} />

      <LegalSection title="1. What Are Cookies" index={2}>
        <p>
          Cookies are small text files stored on your device (computer,
          tablet, or smartphone) when you visit a website. Similar
          technologies, such as the browser&apos;s local storage, work in a
          comparable way and are covered by this policy as well.
        </p>
        <p>
          This Cookie Policy applies to the website{" "}
          <strong className={legalStrongClass}>{legalEntity.website}</strong>{" "}
          and to the Melodyc web application (together, the
          &quot;Service&quot;) operated by{" "}
          <strong className={legalStrongClass}>{legalEntity.name}</strong>{" "}
          (&quot;Melodyc&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;). It is drafted in accordance with the EU General
          Data Protection Regulation (GDPR, Regulation (EU) 2016/679), the
          ePrivacy Directive (2002/58/EC), the Italian Privacy Code
          (Legislative Decree 196/2003, as amended by Legislative Decree
          101/2018), and the Italian Data Protection Authority&apos;s
          Guidelines on cookies and other tracking tools (Decision no. 231 of
          June 10, 2021). It constitutes the information notice required by
          Articles 13 and 14 GDPR for the data processed through cookies and
          similar technologies.
        </p>
      </LegalSection>

      <LegalSection title="2. Who Is Responsible for Your Data" index={3}>
        <p>
          The data controller for the Service is{" "}
          <strong className={legalStrongClass}>{legalEntity.name}</strong>,
          whose details are listed above.
        </p>
        {/* TODO: confirm with counsel that a DPO is not required (Art. 37 GDPR); if one is appointed, add their contact here. */}
        <p>
          We have not appointed a Data Protection Officer (DPO), as this is
          not required under Article 37 GDPR for our processing activities.
          For any privacy request you can contact us directly at{" "}
          <Mail address={legalEntity.privacyEmail} />.
        </p>
        {/* TODO: shown automatically once legalEntity.parentCompany is set to D'Ambrosio Holding S.r.l. */}
        {legalEntity.parentCompany && (
          <>
            <p>
              {legalEntity.name} belongs to a group of companies controlled
              by{" "}
              <strong className={legalStrongClass}>
                {legalEntity.parentCompany}
              </strong>
              , which exercises direction and coordination over it pursuant
              to Article 2497-bis of the Italian Civil Code.
            </p>
            <p>
              {legalEntity.parentCompany} does not operate the Service and
              does not access the data collected through cookies on this
              website. Should this change, this policy will be updated to
              describe the role of each company before any such processing
              begins.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title="3. Legal Basis for Cookie Usage" index={4}>
        <p>
          Pursuant to Article 122 of the Italian Privacy Code and the
          Guidelines mentioned above, we use cookies on the following legal
          bases:
        </p>
        <LegalList>
          <li>
            <strong className={legalStrongClass}>
              Strictly necessary cookies:
            </strong>{" "}
            no consent is required (Article 122(1) of the Italian Privacy
            Code). They are essential to deliver the Service you explicitly
            requested (for example, keeping you signed in) and cannot be
            disabled. The related processing is based on the performance of a
            contract (Art. 6(1)(b) GDPR) and on our legitimate interest in
            keeping the Service secure and working (Art. 6(1)(f) GDPR).
          </li>
          <li>
            <strong className={legalStrongClass}>Analytics cookies:</strong>{" "}
            prior, informed, and specific consent is required (Art. 6(1)(a)
            GDPR). They are only activated after you accept them through our
            cookie banner.
          </li>
          <li>
            <strong className={legalStrongClass}>Marketing cookies:</strong>{" "}
            prior, informed, and specific consent is required (Art. 6(1)(a)
            GDPR). They are only activated after you accept them through our
            cookie banner.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Strictly Necessary Cookies" index={5}>
        <p>
          These cookies enable core features such as authentication, account
          security, and remembering your cookie choices. When the Service is
          served over HTTPS, authentication cookie names may carry the{" "}
          <code className="font-mono text-sm">__Secure-</code> prefix. All
          of them are first-party cookies set by Melodyc on its own domain
          and are never used for profiling.
        </p>
        <LegalTable
          monoFirstColumn
          headers={["Cookie name", "Provider", "Purpose", "Duration"]}
          rows={[
            [
              "better-auth.session_token",
              "Melodyc (Better Auth)",
              "Keeps you securely signed in to your account",
              "7 days, renewed while you use the Service",
            ],
            [
              "better-auth.dont_remember",
              "Melodyc (Better Auth)",
              'Ends your session when the browser closes if you did not select "remember me"',
              "Session",
            ],
            [
              "cookie_consent_id",
              "Melodyc",
              "Links your cookie preferences to the record that proves your consent",
              "12 months",
            ],
            [
              "sidebar_state",
              "Melodyc",
              "Remembers whether the dashboard sidebar is expanded or collapsed",
              "7 days",
            ],
            [
              "legal_lang",
              "Melodyc",
              "Remembers the language (Italian or English) you chose for the legal pages",
              "12 months",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Local Storage" index={6}>
        <p>
          We also store a few technical values in your browser&apos;s local
          storage. They are never sent to third parties and are used only to
          make the Service work as you expect.
        </p>
        <LegalTable
          monoFirstColumn
          headers={["Key", "Provider", "Purpose", "Duration"]}
          rows={[
            [
              "melodyc-cookie-consent",
              "Melodyc",
              "Stores your cookie preferences so the banner is not shown again",
              "Until you clear it, renewed every 12 months",
            ],
            [
              "theme",
              "Melodyc",
              "Remembers your light or dark mode preference",
              "Until you clear it",
            ],
            [
              "melodyc-demo-generation",
              "Melodyc",
              "Lets you get back the song generated with the free public demo",
              "Until you clear it",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Analytics Cookies" index={7}>
        <p>
          Analytics tools help us understand how visitors use the Service so
          we can improve it. With your consent to the{" "}
          <strong className={legalStrongClass}>Analytics</strong> category,
          we load <strong className={legalStrongClass}>Vercel Web Analytics</strong>{" "}
          (pages visited, referrer, country, device and browser type) and{" "}
          <strong className={legalStrongClass}>Vercel Speed Insights</strong>{" "}
          (page loading performance). Both are provided by Vercel Inc. and work
          without cookies: they do not store identifiers on your device and do
          not track you across other websites. Data is aggregated and the
          request-based identifier is discarded within 24 hours. If you do not
          give consent, or withdraw it, these tools are not loaded.
        </p>
      </LegalSection>

      <LegalSection title="7. Marketing Cookies" index={8}>
        <p>
          Marketing cookies are used to track visitors across websites and
          show content relevant to their interests. At the moment, Melodyc{" "}
          <strong className={legalStrongClass}>
            does not use any marketing or profiling cookies
          </strong>
          . If we introduce them, this policy will be updated and your
          consent will be requested before activation.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-Party Services and Data Transfers" index={9}>
        <p>
          The Service relies on the following providers. Some of them process
          data outside the European Economic Area (EEA) or may set their own
          cookies on their own domains (for example, during checkout).
        </p>
        <LegalTable
          headers={["Service", "Purpose", "Data location", "Legal basis"]}
          rows={[
            [
              "Vercel",
              "Website hosting and content delivery",
              "Global CDN, United States (DPF)",
              "Legitimate interest",
            ],
            [
              "Vercel Web Analytics and Speed Insights",
              "Cookieless visit statistics and page performance",
              "United States (DPF)",
              "Consent",
            ],
            [
              "Neon (PostgreSQL)",
              "Database for accounts, songs, credits, and consent records",
              "EU (Frankfurt)",
              "Contract performance / Legal obligation",
            ],
            [
              "Amazon Web Services (S3)",
              "Storage and delivery of generated audio and cover images",
              "EU (Stockholm)",
              "Contract performance",
            ],
            [
              "Modal",
              "GPU cloud infrastructure that runs the AI music models",
              "United States (SCC)",
              "Contract performance",
            ],
            [
              "Inngest",
              "Background processing of song generation jobs",
              "United States (SCC)",
              "Contract performance",
            ],
            [
              "Polar",
              "Checkout, subscriptions, and billing as Merchant of Record",
              "United States / EU (SCC)",
              "Contract performance",
            ],
            [
              "GitHub",
              "Profile pictures of the project contributors shown in the footer",
              "United States (DPF)",
              "Legitimate interest",
            ],
          ]}
        />
        <p>
          Where data is transferred outside the EEA, we rely on appropriate
          safeguards: adequacy decisions under Article 45 GDPR (such as the
          EU-US Data Privacy Framework, &quot;DPF&quot;) or Standard
          Contractual Clauses (&quot;SCC&quot;) under Article 46(2)(c) GDPR.
          You can request a copy of these safeguards by contacting us.
        </p>
        <p>
          Except where stated otherwise, these providers act as data
          processors on our behalf under a data processing agreement
          pursuant to Article 28 GDPR, and may only use the data to provide
          their services to us. GitHub serves the contributor images as an
          independent controller and may receive your IP address when your
          browser loads them.
        </p>
        <p>
          When you complete a purchase, you are redirected to Polar&apos;s
          checkout, which acts as an independent controller and applies its
          own{" "}
          <ExternalLink href="https://polar.sh/legal/privacy">
            Privacy Policy
          </ExternalLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Is Consent Mandatory?" index={10}>
        <p>
          No. Strictly necessary cookies are required for the Service to
          work and are therefore always active. Consent to analytics and
          marketing cookies is entirely optional: if you refuse it, or close
          the banner without making a choice, only strictly necessary
          cookies are used and you can keep using every feature of the
          Service without any limitation.
        </p>
        <p>
          We do not use cookie walls, scrolling or continued browsing are
          never treated as consent, and no non-essential cookie is set
          before you make your choice.
        </p>
      </LegalSection>

      <LegalSection title="10. How to Manage Your Cookie Preferences" index={11}>
        <p>
          When you first visit the Service, a banner lets you accept all
          cookies, reject all non-essential cookies, or choose them by
          category. Accepting and rejecting are equally easy. Closing the
          banner with the &quot;X&quot; button keeps the default settings,
          which means only strictly necessary cookies are used.
        </p>
        <p>
          Your choice is remembered for 12 months. We will show the banner
          again only after this period, if this policy changes in a way that
          affects your consent, or if you clear your browser data.
        </p>
        <p>
          You can change or withdraw your consent at any time by clicking
          the <strong className={legalStrongClass}>Cookies tab</strong> on the
          left side of the page. Withdrawing consent is as easy as giving it
          and does not affect the lawfulness of processing carried out
          before.
        </p>
        <p>
          You can also block or delete cookies through your browser settings.
          Disabling strictly necessary cookies may prevent parts of the
          Service, such as signing in, from working correctly.
        </p>
        <LegalList>
          <li>
            <ExternalLink href="https://support.google.com/chrome/answer/95647">
              Google Chrome
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop">
              Mozilla Firefox
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.apple.com/en-us/105082">
              Safari
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">
              Microsoft Edge
            </ExternalLink>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="11. Proof of Consent" index={12}>
        <p>
          To demonstrate that consent was given, as required by Article 7(1)
          GDPR, we keep a record of your choice containing only: a random
          identifier (also stored in the{" "}
          <code className="font-mono text-sm">cookie_consent_id</code>{" "}
          cookie), the categories you accepted or rejected, the version of
          this policy, the date and time of your choice, and, if you are
          signed in, the link to your account. We do not store your IP
          address or any other identifier for this purpose.
        </p>
      </LegalSection>

      <LegalSection title="12. Your Rights Under the GDPR" index={13}>
        <p>
          Under the GDPR and the Italian Privacy Code, you have the following
          rights regarding personal data processed through cookies:
        </p>
        <LegalList>
          <li>
            <strong className={legalStrongClass}>Right of access</strong>{" "}
            (Art. 15): obtain confirmation and a copy of your data.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Right to rectification
            </strong>{" "}
            (Art. 16): correct inaccurate data.
          </li>
          <li>
            <strong className={legalStrongClass}>Right to erasure</strong>{" "}
            (Art. 17): request the deletion of your data.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Right to restriction of processing
            </strong>{" "}
            (Art. 18): limit how we process your data.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Right to data portability
            </strong>{" "}
            (Art. 20): receive your data in a structured, machine-readable
            format.
          </li>
          <li>
            <strong className={legalStrongClass}>Right to object</strong>{" "}
            (Art. 21): object to processing based on legitimate interest.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Right to withdraw consent
            </strong>{" "}
            (Art. 7(3)): at any time, without affecting prior processing.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Right to lodge a complaint
            </strong>{" "}
            with the Italian Data Protection Authority (Garante per la
            protezione dei dati personali) at{" "}
            <ExternalLink href="https://www.garanteprivacy.it">
              www.garanteprivacy.it
            </ExternalLink>
            , or with the supervisory authority of the EU Member State where
            you live, work, or where the alleged infringement took place
            (Art. 77).
          </li>
        </LegalList>
        <p className="mt-3">
          To exercise these rights, write to{" "}
          <Mail address={legalEntity.privacyEmail} />. Requests are free of
          charge and we will reply without undue delay and in any case within
          one month of receipt, a period that may be extended by two further
          months for complex requests, in which case we will inform you
          (Art. 12(3) GDPR). We may ask you to verify your identity before
          fulfilling the request.
        </p>
        <p>
          No decision based solely on automated processing, including
          profiling, that produces legal or similarly significant effects on
          you is taken through the cookies described in this policy
          (Art. 22 GDPR).
        </p>
      </LegalSection>

      <LegalSection title="13. Data Retention" index={14}>
        <p>
          Your cookie preferences and the related consent record are kept
          for a maximum of{" "}
          <strong className={legalStrongClass}>12 months</strong>{" "}
          from the date of your choice, after which we will ask you to
          confirm them again. Session cookies are deleted when you close your
          browser, and persistent cookies expire as indicated in the tables
          above.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to This Policy" index={15}>
        <p>
          We may update this Cookie Policy to reflect changes in our
          practices, technology, or legal requirements. The date at the top
          of this page shows when it was last updated. If a change affects
          the cookies that require your consent, we will ask for your
          consent again.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact Us" index={16}>
        <p>
          For any questions about this Cookie Policy or how we handle your
          data, contact us:
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            Email: <Mail address={legalEntity.privacyEmail} />
          </li>
          <li>
            PEC: <Mail address={legalEntity.pec} />
          </li>
          <li>
            More details:{" "}
            <Link href="/privacy" className={legalLinkClass}>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </LegalSection>
    </>
  );
}