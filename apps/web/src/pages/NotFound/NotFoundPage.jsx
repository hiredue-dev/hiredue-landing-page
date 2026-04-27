import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>Oops! Page not found</p>
        <a href="/" className={styles.link}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
