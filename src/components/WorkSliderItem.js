import Image from "next/image";

import styles from "./WorkSliderItem.module.scss";

export default function WorkSliderItem({
  imageSrc,
  imageAlt,
  title,
  description,
  moreWorkId,
  variant = "default",
  showMore = true,
  isGalleryMode = false,
  onMore,
}) {
  return (
    <article
      className={styles.item}
      data-work-item
      data-variant={variant}
      data-view={isGalleryMode ? "gallery" : "default"}
    >
      <div className={styles.media}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 74vw, 42vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content} data-work-side-content>
        <div className={styles.copy} data-work-copy>
          <div className={styles.meta}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          {showMore ? (
            <button
              type="button"
              className={styles.moreButton}
              onClick={() => onMore?.(moreWorkId)}
            >
              <span className={styles.moreButtonText}>More</span>
              <Image
                src="/svg/Back.svg"
                alt=""
                aria-hidden="true"
                width={39}
                height={14}
                className={styles.moreArrow}
              />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
