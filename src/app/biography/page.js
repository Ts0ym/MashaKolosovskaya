import InnerInfoPageTemplate from "@/components/InnerInfoPageTemplate.client";

import styles from "./page.module.scss";

export default function BiographyPage() {
  return (
    <InnerInfoPageTemplate
      key="biography"
      pageKey="biography"
      title="Biography"
      imagePanelLabel="Biography photo"
      imageSrc="/Images/Bio/bio.JPG"
      imageAlt="Masha Kolosovskaya sitting on a sofa and reading a book"
      mobileImageWidth={854}
      mobileImageHeight={1280}
    >
      <div className={styles.group}>
        <p>MASHA KOLOSOVSKAYA</p>
        <p>b. 1991 Cheboksary, Russia</p>
        <p>Now works and lives in Moscow</p>
        <p>Bachelor (Department of Housing)</p>
        <p>MARCH (Moscow Architectural Institute, State Academy)</p>
        <p>
          Diploma of Higher Education in Architecture (Department of Soviet and Foreign
          Architecture)
        </p>
      </div>

      <div className={styles.group}>
        <p>Education</p>
        <ul className={styles.timelineList}>
          <li className={styles.timelineItem}>
            <span className={styles.timelineDate}>2009-2013</span>
            <span>Stroganov School ceramics courses</span>
          </li>
          <li className={styles.timelineItem}>
            <span className={styles.timelineDate}>2015-2016</span>
            <span>
              La Meridiani&apos;s School of Ceramics (courses by Pietro Maddalena)
            </span>
          </li>
          <li className={styles.timelineItem}>
            <span className={styles.timelineDate}>2016</span>
            <span>
              La Meridiani&apos;s School of Ceramics (class Eddie Curtis, Sandy
              Lockwood)
            </span>
          </li>
        </ul>
      </div>

      <div className={styles.group}>
        <p>Work Experience</p>
        <ul className={styles.timelineList}>
          <li className={styles.timelineItem}>
            <span className={styles.timelineDate}>2013-2014</span>
            <span>Fashion Assistant at Vogue Magazine</span>
          </li>
        </ul>
      </div>

      <div className={styles.group}>
        <p>Publications</p>
        <ul className={styles.timelineList}>
          <li className={styles.timelineItem}>
            <span className={styles.timelineDate}>2020</span>
            <span>January Vogue Russia Magazine</span>
          </li>
        </ul>
      </div>

      <div className={styles.group}>
        <p>Publications</p>
        <ul className={styles.linksList}>
          <li>
            <a
              href="https://www.elledecoration.ru"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              www.elledecoration.ru
            </a>
          </li>
          <li>
            <a
              href="https://www.admagazine.com"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              www.admagazine.com
            </a>
          </li>
          <li>
            <a
              href="https://www.marieclaire.ru"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              www.marieclaire.ru
            </a>
          </li>
          <li>
            <a
              href="https://www.vogue.ru"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              www.vogue.ru
            </a>
          </li>
        </ul>
      </div>
    </InnerInfoPageTemplate>
  );
}
