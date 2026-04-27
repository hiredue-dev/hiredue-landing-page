import styles from "./TermsPage.module.css";

const TermsPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <h1 className={styles.heading}>Terms of Service — HireDue</h1>
      <p className={styles.updated}>Effective Date: 16th April 2026</p>
      <div className={styles.content}>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using HireDue, you agree to be bound by these Terms of Service.</p>

        <h3>2. Description of Services</h3>
        <p>HireDue provides tools that assist users in:</p>
        <ul>
          <li>Identifying job opportunities</li>
          <li>Managing job applications</li>
          <li>Generating and sending professional communications</li>
        </ul>
        <p>HireDue operates as a user-controlled productivity platform.</p>

        <h3>3. User Authorization and Control</h3>
        <p>All actions within HireDue are controlled by the user.</p>
        <p>This includes:</p>
        <ul>
          <li>Sending emails</li>
          <li>Initiating job-related actions</li>
          <li>Connecting external services</li>
        </ul>
        <p>HireDue does not initiate actions independently without user authorization.</p>

        <h3>4. Google Integration</h3>
        <p>When connecting a Google account:</p>
        <ul>
          <li>Users grant permission to send emails via Gmail</li>
          <li>Access is limited to the granted scope (gmail.send)</li>
          <li>Users may revoke access at any time</li>
        </ul>
        <p>HireDue complies with all applicable Google API policies.</p>

        <h3>5. Acceptable Use</h3>
        <p>Users agree not to:</p>
        <ul>
          <li>Send unsolicited bulk or spam emails</li>
          <li>Use the platform for abusive or misleading communication</li>
          <li>Violate applicable laws or platform policies</li>
        </ul>

        <h3>6. User Responsibilities</h3>
        <p>Users are solely responsible for:</p>
        <ul>
          <li>Content of communications sent</li>
          <li>Compliance with third-party platform rules</li>
          <li>Ensuring ethical use of the platform</li>
        </ul>

        <h3>7. Third-Party Services</h3>
        <p>HireDue interacts with third-party platforms.</p>
        <p>We are not responsible for:</p>
        <ul>
          <li>Platform changes</li>
          <li>Service interruptions</li>
          <li>Account restrictions imposed by third parties</li>
        </ul>

        <h3>8. Intellectual Property</h3>
        <p>All rights in the HireDue platform remain with the Company.</p>

        <h3>9. Disclaimer of Warranties</h3>
        <p>The service is provided &ldquo;as is&rdquo; without guarantees, including:</p>
        <ul>
          <li>Job outcomes</li>
          <li>Response rates</li>
          <li>Platform compatibility</li>
        </ul>

        <h3>10. Limitation of Liability</h3>
        <p>HireDue shall not be liable for:</p>
        <ul>
          <li>Indirect or consequential damages</li>
          <li>Loss of opportunities</li>
          <li>Third-party platform actions</li>
        </ul>

        <h3>11. Termination</h3>
        <p>We may suspend or terminate access if:</p>
        <ul>
          <li>Terms are violated</li>
          <li>Misuse is detected</li>
        </ul>

        <h3>12. Changes to Terms</h3>
        <p>We reserve the right to update these Terms.</p>

        <h3>13. Governing Law</h3>
        <p>India</p>

        <h3>14. Contact</h3>
        <p>team@hiredue.com</p>
      </div>
    </div>
  </section>
);

export default TermsPage;
