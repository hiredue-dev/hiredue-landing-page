'use client';

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  LayoutGrid,
  Link2,
  MessageSquare,
  Network,
  Puzzle,
  Smartphone,
  Users,
  Zap,
  FileStack,
} from "lucide-react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { featureVotingContent } from "@/content/home/featureVotingContent.js";
import styles from "./FeatureVotingSection.module.css";

const iconMap = {
  smartphone: Smartphone,
  zap: Zap,
  puzzle: Puzzle,
  messageSquare: MessageSquare,
  link: Link2,
  users: Users,
  network: Network,
  layoutGrid: LayoutGrid,
  fileStack: FileStack,
};

const FeatureVotingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { building, voting, backlog } = featureVotingContent.columns;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [votedIds, setVotedIds] = useState([]);
  const [votesById, setVotesById] = useState(() => Object.fromEntries(voting.items.map((item) => [item.id, item.votes])));

  const filteredVoting = useMemo(() => {
    const visible = selectedCategory === "all" ? voting.items : voting.items.filter((item) => item.category === selectedCategory);
    return [...visible].sort((a, b) => votesById[b.id] - votesById[a.id]);
  }, [selectedCategory, voting.items, votesById]);

  const handleVote = (id) => {
    if (votedIds.includes(id)) return;
    setVotesById((current) => ({ ...current, [id]: current[id] + 1 }));
    setVotedIds((current) => [...current, id]);
  };

  return (
    <Section tone="muted" ref={ref} className={styles.section}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading
          title={featureVotingContent.heading}
          className={styles.headingWrap}
          titleClassName={styles.heading}
        />
      </motion.div>

      <motion.div
        className={styles.board}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <div className={styles.column}>
          <header className={styles.columnHeader}>{building.title}</header>
          <div className={styles.columnBody}>
            {building.items.map((item) => {
              const Icon = iconMap[item.icon] || Smartphone;
              return (
                <article key={item.id} className={`${styles.buildCard} ${item.active ? styles.buildCardActive : ""}`.trim()}>
                  {item.active ? (
                    <div className={styles.statusBadge}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      In Progress
                    </div>
                  ) : null}

                  <div className={styles.cardTop}>
                    <div className={styles.iconWrap}>
                      <Icon size={18} strokeWidth={1.8} className={styles.icon} aria-hidden="true" />
                    </div>
                    <h3 className={styles.cardTitle}>{item.label}</h3>
                  </div>

                  <p className={styles.cardText}>{item.summary}</p>

                  <div className={styles.progressMeta}>
                    <span>{item.progress}% Complete</span>
                  </div>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <span className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                  </div>

                  <ul className={styles.subfeatures}>
                    {item.subfeatures.map((subfeature) => (
                      <li key={subfeature}>{subfeature}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.column}>
          <header className={styles.columnHeader}>{voting.title}</header>
          <div className={styles.filterBar}>
            {voting.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`${styles.filterTag} ${selectedCategory === category.id ? styles.filterTagActive : ""}`.trim()}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className={styles.columnBody}>
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredVoting.map((item) => {
                const Icon = iconMap[item.icon] || Smartphone;
                const voteCount = votesById[item.id] ?? item.votes;
                const isExpanded = expandedId === item.id;
                const isVoted = votedIds.includes(item.id);

                return (
                  <motion.article
                    key={item.id}
                    layout
                    className={styles.voteCard}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className={styles.voteMainRow}>
                      <div className={styles.cardTop}>
                        <div className={styles.iconWrap}>
                          <Icon size={18} strokeWidth={1.8} className={styles.icon} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className={styles.cardTitle}>{item.label}</h3>
                          <motion.p
                            key={voteCount}
                            className={styles.voteCount}
                            initial={{ scale: 1.04 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.1 }}
                          >
                            {voteCount} votes
                          </motion.p>
                        </div>
                      </div>

                      <div className={styles.voteActions}>
                        <button
                          type="button"
                          className={`${styles.voteButton} ${isVoted ? styles.voteButtonDone : ""}`.trim()}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleVote(item.id);
                          }}
                        >
                          {isVoted ? <Check size={14} aria-hidden="true" /> : "+1"}
                          {isVoted ? "Voted" : "Upvote"}
                        </button>
                        <ChevronDown
                          size={16}
                          className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ""}`.trim()}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          className={styles.expandPanel}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <p>{item.details}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.column}>
          <header className={styles.columnHeader}>{backlog.title}</header>
          <div className={styles.columnBody}>
            {backlog.items.map((item) => {
              const Icon = iconMap[item.icon] || Smartphone;
              return (
                <article key={item.id} className={styles.backlogCard}>
                  <div className={styles.iconWrap}>
                    <Icon size={18} strokeWidth={1.8} className={styles.icon} aria-hidden="true" />
                  </div>
                  <h3 className={styles.cardTitle}>{item.label}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default FeatureVotingSection;
