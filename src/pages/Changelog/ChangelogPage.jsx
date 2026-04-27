import styles from "./ChangelogPage.module.css";
import { changelogPageContent } from "@/content/pages/changelogPageContent.js";

const ChangelogPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <h1 className={styles.heading}>{changelogPageContent.heading}</h1>
      <p className={styles.lead}>{changelogPageContent.lead}</p>

      <div className={styles.timeline}>
        {changelogPageContent.updates.map((entry) => (
          <article key={`${entry.version}-${entry.date}`} className={styles.entry}>
            <p className={styles.date}>{entry.date}</p>

            <div className={styles.railCell} aria-hidden="true">
              <span className={styles.node} />
            </div>

            <div className={styles.card}>
              <h2>{entry.version}</h2>
              <ul>
                {entry.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ChangelogPage;
