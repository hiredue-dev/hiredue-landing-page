import { careersPageContent } from "@/content/pages/careersPageContent.js";
import styles from "./CareersPage.module.css";

const CareersPage = () => {
  const { hero, quote, openingsSection, applyGuidance, applyUrl, openings } = careersPageContent;
  const hasOpenings = openings.length > 0;
  const MOSAIC_COLS = 24;
  const MOSAIC_ROWS = 6;

  const avatarIds = [
    12, 17, 21, 24, 28, 31, 34, 37, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 4, 7, 10, 13,
    16, 19, 22, 25, 29, 32, 35, 38, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 6, 9, 14, 18, 23, 27,
    30, 33, 36, 39, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 8, 11, 15, 20, 26, 40, 81, 82, 83, 84,
  ];

  const rowMap = [
    { row: 1, start: 8, end: 17, opacity: 0.78 },
    { row: 2, start: 6, end: 19, opacity: 0.84 },
    { row: 3, start: 5, end: 20, opacity: 0.92 },
    { row: 4, start: 5, end: 21, opacity: 0.94 },
    { row: 5, start: 6, end: 19, opacity: 0.84 },
    { row: 6, start: 8, end: 17, opacity: 0.78 },
  ];

  let avatarIndex = 0;
  const avatarCluster = rowMap.flatMap(({ row, start, end, opacity }) =>
    Array.from({ length: end - start + 1 }, (_, i) => {
      const col = start + i;
      const isAccent = row === 3 && col === 20;
      const img = avatarIds[avatarIndex % avatarIds.length];
      avatarIndex += 1;
      return {
        row,
        col,
        img,
        opacity: isAccent ? 0.98 : opacity,
        isAccent,
      };
    }),
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.heading}>
            <span className={styles.headingPrimary}>{hero.heading}</span>{" "}
            <span className={styles.headingMuted}>{hero.highlighted}</span>
          </h1>

          <div
            className={styles.mosaic}
            style={{
              "--mosaic-cols": `${MOSAIC_COLS}`,
              "--mosaic-rows": `${MOSAIC_ROWS}`,
            }}
            aria-hidden="true"
          >
            <div className={styles.dotGrid}>
              {Array.from({ length: MOSAIC_COLS * MOSAIC_ROWS }).map((_, index) => (
                <span key={index} className={styles.avatarDot} />
              ))}
            </div>
            <div className={styles.cluster}>
              {avatarCluster.map((avatar, index) => (
                <span
                  key={`${avatar.row}-${avatar.col}-${index}`}
                  className={`${styles.avatarPhoto} ${avatar.isAccent ? styles.avatarAccent : ""}`}
                  style={{
                    gridColumn: avatar.col,
                    gridRow: avatar.row,
                    backgroundImage: `url(https://i.pravatar.cc/48?img=${avatar.img})`,
                    opacity: avatar.opacity,
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.quoteStrip}>
            <p className={styles.quoteText}>“{quote.text}”</p>
            <p className={styles.quoteMeta}>
              <span>{quote.author}</span> — {quote.role}
            </p>
          </div>
        </header>

        <section className={styles.openingsSection}>
          <h2 className={styles.sectionTitle}>{openingsSection.heading}</h2>
          <p className={styles.sectionLead}>{openingsSection.lead}</p>

          {hasOpenings ? (
            <div className={styles.openingsList}>
              {openings.map((opening) => (
                <article key={opening.id} className={styles.openingCard}>
                  <div className={styles.openingHeader}>
                    <h3>{opening.title}</h3>
                    <a href={applyUrl} target="_blank" rel="noreferrer" className={styles.applyButton}>
                      Apply
                    </a>
                  </div>
                  <p className={styles.openingMeta}>
                    {opening.team} · {opening.location} · {opening.type}
                  </p>
                  <p className={styles.openingSummary}>{opening.summary}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No open roles currently.</p>
              <a href={applyUrl} target="_blank" rel="noreferrer" className={styles.applyButton}>
                Join talent pool
              </a>
            </div>
          )}
        </section>

        <section className={styles.guidanceSection}>
          <h2 className={styles.sectionTitle}>{applyGuidance.heading}</h2>
          <p className={styles.guidanceBody}>{applyGuidance.body}</p>
          <p className={styles.fallbackEmail}>
            Questions: <a href={`mailto:${applyGuidance.fallbackEmail}`}>{applyGuidance.fallbackEmail}</a>
          </p>
        </section>
      </div>
    </section>
  );
};

export default CareersPage;
