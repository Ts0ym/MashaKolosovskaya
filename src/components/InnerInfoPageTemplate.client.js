"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import styles from "@/components/InnerInfoPageTemplate.module.scss";
import InnerPageMobileHeader from "@/components/InnerPageMobileHeader.client";
import TransitionBackLink from "@/components/TransitionBackLink.client";
import { revealPageTransition } from "@/lib/pageTransitionController";

function toSlug(value) {
  return String(value || "page")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function InnerInfoPageTemplate({
  pageKey,
  title,
  titleId,
  imagePanelLabel,
  imageSrc,
  imageAlt,
  mobileImageWidth,
  mobileImageHeight,
  desktopImageObjectPosition,
  mobileImageObjectPosition,
  children,
}) {
  const rootRef = useRef(null);
  const isLeavingRef = useRef(false);
  const resolvedTitleId = useMemo(
    () => titleId || `${toSlug(title)}-title`,
    [title, titleId],
  );

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    // Reset transition lock and replay intro when the rendered page payload changes.
    isLeavingRef.current = false;

    const ctx = gsap.context(() => {
      const textPanel = rootRef.current.querySelector("[data-inner-text-panel]");
      const imagePanel = rootRef.current.querySelector("[data-inner-image-panel]");
      const textBody = rootRef.current.querySelector("[data-inner-text-body]");
      const titleNode = rootRef.current.querySelector("[data-inner-title]");
      const backStrip = rootRef.current.querySelector("[data-inner-back]");
      const blocks = textBody ? Array.from(textBody.children) : [];
      const imageMedia = imagePanel
        ? gsap.utils.toArray(imagePanel.querySelectorAll(`.${styles.image}`))
        : [];

      gsap.set(imagePanel, { autoAlpha: 0.72 });
      gsap.set(imageMedia, { scale: 1.2, transformOrigin: "50% 50%" });
      gsap.set(textPanel, { autoAlpha: 1 });
      gsap.set([titleNode, ...blocks], { autoAlpha: 0, yPercent: 16 });
      gsap.set(backStrip, { autoAlpha: 0, yPercent: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.to(
        imagePanel,
        {
          autoAlpha: 1,
          duration: 1.05,
        },
        0,
      )
        .to(
          imageMedia,
          {
            scale: 1,
            duration: 1.05,
          },
          0,
        )
        .to(
          titleNode,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.7,
          },
          0.18,
        )
        .to(
          blocks,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.65,
            stagger: 0.07,
          },
          0.28,
        )
        .to(
          backStrip,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
          },
          0.36,
        );

    }, rootRef);

    // Keep the curtain tween out of the page GSAP context so route-change cleanup
    // cannot kill it while switching between pages that reuse this template.
    revealPageTransition({ duration: 0.92, delay: 0.08 });

    return () => {
      ctx.revert();
    };
  }, [pageKey, title, imageSrc]);

  const desktopImageStyle = desktopImageObjectPosition
    ? { objectPosition: desktopImageObjectPosition }
    : undefined;
  const resolvedMobileObjectPosition = mobileImageObjectPosition || desktopImageObjectPosition;
  const mobileImageStyle = resolvedMobileObjectPosition
    ? { objectPosition: resolvedMobileObjectPosition }
    : undefined;

  return (
    <main className={styles.page} ref={rootRef}>
      <InnerPageMobileHeader
        headerClassName={styles.mobileHeader}
        overlayClassName={styles.mobileOverlayFixed}
        transitionLockRef={isLeavingRef}
      />

      <section
        className={styles.textPanel}
        aria-labelledby={resolvedTitleId}
        data-inner-text-panel
      >
        <div className={styles.textScroll}>
          <div className={styles.textContent}>
            <h1 id={resolvedTitleId} className={styles.title} data-inner-title>
              {title}
            </h1>

            <div className={styles.textBody} data-inner-text-body>
              {children}
            </div>
          </div>
        </div>

        <div className={styles.backStrip} data-inner-back>
          <TransitionBackLink
            href="/"
            className={styles.backLink}
            arrowClassName={styles.backArrow}
            transitionLockRef={isLeavingRef}
          />
        </div>
      </section>

      <section
        className={styles.imagePanel}
        aria-label={imagePanelLabel}
        data-inner-image-panel
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 68vw"
          className={`${styles.image} ${styles.imageDesktop}`}
          style={desktopImageStyle}
        />
        <Image
          src={imageSrc}
          alt=""
          aria-hidden="true"
          width={mobileImageWidth}
          height={mobileImageHeight}
          sizes="100vw"
          className={`${styles.image} ${styles.imageMobile}`}
          style={mobileImageStyle}
        />
      </section>
    </main>
  );
}
