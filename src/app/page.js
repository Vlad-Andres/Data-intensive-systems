import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.badge}>Static starter template</p>
          <h1>One-page app for visualizations, dashboards, and blog content.</h1>
          <p>
            This template includes placeholder sections only. Add your own data
            sources, charting libraries, and content when you are ready.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Visualization area</h2>
            <p>Reserved for charts, maps, timelines, or other visual components.</p>
          </article>
          <article className={styles.card}>
            <h2>Dashboard widgets</h2>
            <p>Use this area for KPI cards, quick stats, filters, and summaries.</p>
          </article>
          <article className={styles.card}>
            <h2>Personal blog stream</h2>
            <p>Placeholder for article previews, tags, publication dates, and links.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
