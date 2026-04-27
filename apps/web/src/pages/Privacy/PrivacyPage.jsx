import styles from "./PrivacyPage.module.css";

const PrivacyPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <h1 className={styles.heading}>Privacy Policy — HireDue</h1>
      <p className={styles.updated}>Effective Date: 16th April 2026</p>
      <p className={styles.updated}>Last Updated: 16th April 2026</p>
      <div className={styles.content}>
        <h3>1. Introduction</h3>
        <p>
          HireDue (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) provides a software platform that assists users in managing and streamlining their job application workflows, including identifying opportunities and facilitating professional communication.
        </p>
        <p>
          We are committed to protecting user privacy through a privacy-first, user-controlled architecture, where sensitive data is processed locally on the user&rsquo;s device wherever feasible.
        </p>
        <p>This Privacy Policy explains how we collect, use, store, and safeguard personal information.</p>

        <h3>2. Scope and Applicability</h3>
        <p>This Privacy Policy applies to:</p>
        <ul>
          <li>HireDue desktop application</li>
          <li>HireDue website</li>
          <li>Any associated services or integrations, including Google APIs</li>
        </ul>
        <p>This policy applies globally, subject to applicable data protection laws.</p>

        <h3>3. Key Privacy Principles</h3>
        <p>HireDue is designed around the following principles:</p>
        <ul>
          <li>Data Minimization — Only necessary data is collected</li>
          <li>User Control — Users control all actions (including email sending)</li>
          <li>Local Processing First — Sensitive data remains on-device where possible</li>
          <li>Purpose Limitation — Data is used only for explicitly defined purposes</li>
          <li>No Data Sale — Personal data is never sold</li>
        </ul>

        <h3>4. Categories of Data Collected</h3>
        <h3>4.1 Information Provided by Users</h3>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Resume / CV and professional details</li>
          <li>Job preferences and search criteria</li>
        </ul>
        <h3>4.2 Usage and Operational Data</h3>
        <ul>
          <li>Application activity initiated by the user</li>
          <li>Status of job applications</li>
          <li>System logs (errors, performance diagnostics)</li>
        </ul>
        <h3>4.3 Google Account Data (OAuth Integration)</h3>
        <p>When you connect your Google account, we access:</p>
        <ul>
          <li>Permission to send emails via Gmail (gmail.send scope only)</li>
        </ul>
        <p>We do not collect:</p>
        <ul>
          <li>Gmail passwords</li>
          <li>Inbox content</li>
          <li>Email history</li>
        </ul>

        <h3>5. How We Use Personal Data</h3>
        <p>We process personal data strictly for the following purposes:</p>
        <ul>
          <li>Facilitating job application workflows</li>
          <li>Generating personalized communication drafts</li>
          <li>Enabling users to send emails through their Gmail account</li>
          <li>Providing tracking and visibility into application activity</li>
          <li>Maintaining system performance and reliability</li>
        </ul>

        <h3>6. Google API Services User Data Compliance</h3>
        <p>
          HireDue&rsquo;s use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.
        </p>
        <h3>6.1 Scope of Access</h3>
        <p>HireDue only requests:</p>
        <ul>
          <li>gmail.send permission</li>
        </ul>
        <h3>6.2 Use of Data</h3>
        <p>Google user data is used solely to:</p>
        <ul>
          <li>Enable users to send emails from their own Gmail account</li>
        </ul>
        <h3>6.3 Restrictions</h3>
        <p>HireDue explicitly commits that:</p>
        <ul>
          <li>Google user data is not used for advertising purposes</li>
          <li>Google user data is not sold or transferred to third parties</li>
          <li>Google user data is not used for profiling or tracking users across services</li>
          <li>Google user data is not accessed beyond the functionality explicitly requested by the user</li>
        </ul>
        <h3>6.4 No Background Access</h3>
        <ul>
          <li>Emails are sent only when initiated by the user</li>
          <li>HireDue does not perform automated or background email sending</li>
        </ul>

        <h3>7. Local-First Processing Architecture</h3>
        <p>HireDue follows a hybrid architecture:</p>
        <h3>7.1 Local Processing (On User Device)</h3>
        <ul>
          <li>Session handling</li>
          <li>Interaction with external platforms</li>
          <li>Email sending actions triggered by the user</li>
        </ul>
        <p>Sensitive credentials remain on the user&rsquo;s device.</p>
        <h3>7.2 Cloud Processing</h3>
        <p>Limited data may be stored securely in cloud systems:</p>
        <ul>
          <li>Resume data (for personalization)</li>
          <li>Job-related data (for matching and tracking)</li>
          <li>Application activity logs</li>
        </ul>

        <h3>8. Data Sharing and Disclosure</h3>
        <p>HireDue does not sell, rent, or trade personal data.</p>
        <p>Data may be shared only:</p>
        <ul>
          <li>With infrastructure providers (e.g., hosting services)</li>
          <li>When required by applicable law</li>
        </ul>
        <p>All third-party processors are bound by confidentiality and data protection obligations.</p>

        <h3>9. Data Retention</h3>
        <p>We retain personal data only for as long as necessary to:</p>
        <ul>
          <li>Provide the service</li>
          <li>Meet legal or operational requirements</li>
        </ul>
        <p>Users may request deletion at any time.</p>

        <h3>10. Data Security</h3>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>Encrypted communication (HTTPS/TLS)</li>
          <li>Controlled system access</li>
          <li>Secure handling of authentication tokens</li>
          <li>Local storage of sensitive credentials</li>
        </ul>

        <h3>11. User Rights</h3>
        <p>Users have the right to:</p>
        <ul>
          <li>Access their personal data</li>
          <li>Request correction</li>
          <li>Request data deletion</li>
          <li>Revoke Google account access</li>
          <li>Discontinue use of the service</li>
        </ul>

        <h3>12. Responsible Use Policy</h3>
        <p>HireDue is intended for legitimate professional use only.</p>
        <p>The platform must not be used for:</p>
        <ul>
          <li>Spam or unsolicited mass communication</li>
          <li>Harassment or abusive messaging</li>
          <li>Misrepresentation</li>
        </ul>

        <h3>13. Children&rsquo;s Privacy</h3>
        <p>HireDue is not intended for individuals under the age of 18.</p>

        <h3>14. Updates to this Policy</h3>
        <p>We may update this Privacy Policy periodically. Updates will be reflected with a revised &ldquo;Last Updated&rdquo; date.</p>

        <h3>15. Contact Information</h3>
        <p>team@hiredue.com</p>
      </div>
    </div>
  </section>
);

export default PrivacyPage;
