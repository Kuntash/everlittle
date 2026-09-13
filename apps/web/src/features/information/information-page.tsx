import { Brand } from "@/components/design/shared";
import { CookiePreferencesLink } from "@/components/cookie-preferences-link";
import "./information.css";

const email = "kunga@geteverlittle.com";
export const informationPages = {
  about: {
    title: "About Everlittle",
    intro: "A place for the little things that become your family’s story.",
    sections: [
      [
        "What Everlittle is",
        "Everlittle is a web app for keeping family photographs, videos, voice recordings, stories and letters in a shared family archive. It gives those memories a place to return to, with the people and context that make them meaningful.",
      ],
      [
        "A family archive, with choices about sharing",
        "Family members join by invitation. Their role determines what they can view, contribute or manage. Parents choose what appears in the child view. A memory’s author can also create a separate public link for that memory; anyone with that link can view it until it expires or is disabled.",
      ],
      [
        "Letters for later",
        "Time capsules let you set an opening date for a message. Locked capsule content becomes available when its opening time arrives. Ordinary stories and photographs can be kept alongside those messages.",
      ],
      [
        "Built for the web",
        "Everlittle runs in a browser and can be added to a supported device’s Home Screen. The hosted family plan is paid; account creation is free. See Pricing for the current plan and storage allowance.",
      ],
    ],
  },
  contact: {
    title: "Contact Everlittle",
    intro: "Questions, feedback, or help with your family archive? Write to Kunga.",
    sections: [
      [
        "Product questions and support",
        "Tell us what you were trying to do, what happened, and which browser or device you used. For account questions, write from the email address associated with your account when possible.",
      ],
      [
        "Privacy and account requests",
        "Use the same contact address for questions about your information or requests concerning your account. Please do not email your password, a child’s PIN, private family photographs or a public-memory link. We may need to verify account ownership before handling a request.",
      ],
      [
        "Creators and collaborations",
        "If your work is about family stories, memory keeping or letters, we would welcome hearing about it. Include a public link to your work and what you have in mind.",
      ],
    ],
  },
  privacy: {
    title: "Privacy at Everlittle",
    intro: "How the hosted app handles family information, sharing and measurement.",
    sections: [
      [
        "Account and family information",
        "Everlittle stores account information such as your name and email address, family memberships and roles, child profiles, and the memories you choose to upload or write. It uses this information to sign you in, display your archive, manage access and deliver features such as invitations and time capsules.",
      ],
      [
        "Who can see a memory",
        "Access to the archive is based on family membership, role and the memory’s audience. The child view has its own access controls. Locked time-capsule content is withheld until its opening time. Private does not mean end-to-end encrypted: the service processes and stores content to provide these features.",
      ],
      [
        "Public-memory links",
        "A memory’s author can enable a public link that expires after 30 days and can be disabled earlier. Anyone with a working link can see that memory, including its displayed names and attribution, without joining the archive. Disabling the link cannot remove copies or screenshots someone has already made. Public-memory pages are marked not to be indexed by search engines; this is not an access restriction.",
      ],
      [
        "Services used to run Everlittle",
        "The hosted app uses Cloudflare for hosting, database storage, media storage and email delivery. Dodo Payments handles subscription checkout and billing. Everlittle stores subscription status and billing identifiers so it can manage access. PostHog receives product-usage events. These services process information needed for their respective functions.",
      ],
      [
        "Cookies and product analytics",
        "Essential cookies support account sessions. The app also uses browser storage for preferences and attribution. PostHog product analytics is configured without automatic interaction capture or session recording; analytics properties are filtered to avoid sending family content, names and private archive paths. Product analytics is separate from the Google advertising choice below.",
      ],
      [
        "Google advertising measurement",
        "Google advertising cookies and conversion events help us understand which ads lead to signups, checkouts and purchases. US visitors use an opt-out default with restricted data processing; other or unknown regions require opt-in. A saved refusal or Global Privacy Control signal overrides the default. The Allow / Not allow choice controls Google advertising measurement, not PostHog product analytics. Family photos, stories and child names are not included in these advertising events.",
      ],
      [
        "Your choices and requests",
        "Review who belongs to your archive and which memories they can access. You can manage memories and export archive content using the available app controls. For account or privacy requests, contact Kunga at the address below. Keep a separate copy of irreplaceable originals. Contact us if you need details about retention or deletion for your account.",
      ],
    ],
  },
} as const;
export type InformationPageId = keyof typeof informationPages;
export function InformationPage({ page }: { page: InformationPageId }) {
  const content = informationPages[page];
  return (
    <div className="apricot information-page">
      <a className="information-skip" href="#information-content">
        Skip to content
      </a>
      <header className="information-header">
        <a href="/" aria-label="Everlittle home">
          <Brand />
        </a>
        <nav aria-label="Main navigation">
          <a href="/journal">Journal</a>
          <a href="/pricing">Pricing</a>
          <a href="/sign-in">Sign in</a>
        </nav>
      </header>
      <main id="information-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true"> / </span>
          <span>{content.title}</span>
        </nav>
        <p className="eyebrow">Everlittle</p>
        <h1>{content.title}</h1>
        <p className="information-intro">{content.intro}</p>
        {page === "privacy" && <p className="information-date">Updated 11 September 2026</p>}
        {page === "contact" && (
          <a className="information-email" href={`mailto:${email}`}>
            {email}
          </a>
        )}
        {content.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        {page === "about" && (
          <p>
            <a href="/pricing">View plans and pricing</a> ·{" "}
            <a href="/privacy">Read about privacy</a>
          </p>
        )}
        {page === "privacy" && (
          <section>
            <h2>Change advertising preferences</h2>
            <CookiePreferencesLink />
            <p>
              <a href="https://business.safety.google/privacy/">How Google uses data</a>
            </p>
          </section>
        )}
        <section>
          <h2>Get in touch</h2>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </section>
      </main>
      <footer>
        <nav aria-label="Footer">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="https://www.instagram.com/geteverlittle/">Instagram</a>
          <CookiePreferencesLink />
        </nav>
      </footer>
    </div>
  );
}
