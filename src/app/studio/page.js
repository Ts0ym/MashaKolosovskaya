"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import shellStyles from "@/components/InnerInfoPageTemplate.module.scss";
import InnerPageMobileHeader from "@/components/InnerPageMobileHeader.client";
import TransitionBackLink from "@/components/TransitionBackLink.client";
import WorksCarousel from "@/components/WorksCarousel.client";
import WorkSliderItem from "@/components/WorkSliderItem";
import { STUDIO_ITEMS } from "@/data/studio";
import { revealPageTransition } from "@/lib/pageTransitionController";

import styles from "@/app/works/page.module.scss";

export default function StudioPage() {
  const rootRef = useRef(null);
  const isLeavingRef = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    isLeavingRef.current = false;

    const ctx = gsap.context(() => {
      const textPanel = rootRef.current.querySelector("[data-studio-text-panel]");
      const studioPanel = rootRef.current.querySelector("[data-studio-panel]");
      const titleNode = rootRef.current.querySelector("[data-studio-title]");
      const textBody = rootRef.current.querySelector("[data-studio-text-body]");
      const backStrip = rootRef.current.querySelector("[data-studio-back]");
      const blocks = textBody ? Array.from(textBody.children) : [];

      gsap.set(textPanel, { autoAlpha: 1 });
      gsap.set(studioPanel, { autoAlpha: 0.76 });
      gsap.set([titleNode, ...blocks], { autoAlpha: 0, yPercent: 16 });
      gsap.set(backStrip, { autoAlpha: 0, yPercent: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.to(
        studioPanel,
        {
          autoAlpha: 1,
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
          0.16,
        )
        .to(
          blocks,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.68,
            stagger: 0.07,
          },
          0.26,
        )
        .to(
          backStrip,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
          },
          0.34,
        );
    }, rootRef);

    revealPageTransition({ duration: 0.92, delay: 0.08 });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className={shellStyles.page} ref={rootRef}>
      <InnerPageMobileHeader
        headerClassName={shellStyles.mobileHeader}
        overlayClassName={shellStyles.mobileOverlayFixed}
        transitionLockRef={isLeavingRef}
      />

      <section
        className={`${shellStyles.textPanel} ${styles.textPanel}`}
        aria-labelledby="studio-title"
        data-studio-text-panel
      >
        <div className={shellStyles.textScroll}>
          <div className={shellStyles.textContent}>
            <h1 id="studio-title" className={shellStyles.title} data-studio-title>
              Studio
            </h1>

            <div className={shellStyles.textBody} data-studio-text-body>
              <div className={styles.copyBlock}>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
                  quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem.
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                  laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
                  reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                  Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${shellStyles.backStrip} ${styles.desktopBackStrip}`} data-studio-back>
          <TransitionBackLink
            href="/"
            className={shellStyles.backLink}
            arrowClassName={shellStyles.backArrow}
            transitionLockRef={isLeavingRef}
          />
        </div>
      </section>

      <section className={styles.worksPanel} aria-label="Studio slider" data-studio-panel>
        <div className={`${styles.slider} ${styles.desktopSlider}`}>
          <WorksCarousel items={STUDIO_ITEMS} itemVariant="studio" showMore={false} />
        </div>

        <div className={styles.mobileList} aria-label="Studio list">
          {STUDIO_ITEMS.map((item) => (
            <WorkSliderItem
              key={item.id}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              title={item.title}
              description={item.description}
              variant="studio"
              showMore={false}
            />
          ))}
        </div>

        <div className={styles.mobileBackStrip}>
          <TransitionBackLink
            href="/"
            className={shellStyles.backLink}
            arrowClassName={shellStyles.backArrow}
            transitionLockRef={isLeavingRef}
          />
        </div>
      </section>
    </main>
  );
}
