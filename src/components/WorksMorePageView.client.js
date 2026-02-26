"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import shellStyles from "@/components/InnerInfoPageTemplate.module.scss";
import InnerPageMobileHeader from "@/components/InnerPageMobileHeader.client";
import TransitionBackLink from "@/components/TransitionBackLink.client";
import WorksCarousel from "@/components/WorksCarousel.client";
import { revealPageTransition } from "@/lib/pageTransitionController";

import styles from "@/app/works/more/page.module.scss";

export default function WorksMorePageView({ items, workTitle }) {
  const rootRef = useRef(null);
  const isLeavingRef = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    isLeavingRef.current = false;

    const ctx = gsap.context(() => {
      const slider = rootRef.current.querySelector("[data-works-more-slider]");
      const backDock = rootRef.current.querySelector("[data-works-more-back]");

      gsap.set(slider, { autoAlpha: 0.84, y: 16 });
      gsap.set(backDock, { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.to(
        slider,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
        },
        0.12,
      ).to(
        backDock,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
        },
        0.28,
      );
    }, rootRef);

    revealPageTransition({ duration: 0.92, delay: 0.08 });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className={styles.page} ref={rootRef}>
      <InnerPageMobileHeader
        headerClassName={`${shellStyles.mobileHeader} ${styles.mobileHeaderPlacement}`}
        overlayClassName={shellStyles.mobileOverlayFixed}
        transitionLockRef={isLeavingRef}
      />

      <section className={styles.desktopStage} aria-label="Works gallery" data-works-more-slider>
        <div className={styles.desktopSlider}>
          <WorksCarousel items={items} isGalleryMode />
        </div>
      </section>

      <section className={styles.mobileCarouselSection} aria-label="Works gallery mobile">
        <div className={styles.mobileCarouselViewport}>
          <div className={styles.mobileCarouselTrack}>
            {items.map((item, index) => (
              <article
                key={`work-more-mobile-slide-${item.id ?? index}`}
                className={styles.mobileCarouselSlide}
              >
                <div className={styles.mobileCarouselMedia}>
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="90vw"
                    className={styles.mobileCarouselImage}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.mobileMetaBar}>
        <h1 className={styles.mobileWorkTitle}>{workTitle}</h1>

        <TransitionBackLink
          href="/works"
          className={shellStyles.backLink}
          arrowClassName={shellStyles.backArrow}
          transitionLockRef={isLeavingRef}
        />
      </div>

      <div className={styles.mobileBottomSpacer} aria-hidden="true" />
      
      <div className={styles.desktopBackDock} data-works-more-back>
        <TransitionBackLink
          href="/works"
          className={shellStyles.backLink}
          arrowClassName={shellStyles.backArrow}
          transitionLockRef={isLeavingRef}
        />
      </div>
    </main>
  );
}
