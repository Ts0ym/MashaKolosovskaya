"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import shellStyles from "@/components/InnerInfoPageTemplate.module.scss";
import InnerPageMobileHeader from "@/components/InnerPageMobileHeader.client";
import TransitionBackLink from "@/components/TransitionBackLink.client";
import WorksCarousel from "@/components/WorksCarousel.client";
import WorkSliderItem from "@/components/WorkSliderItem";
import { WORKS_ITEMS } from "@/data/works";
import { coverPageTransition, revealPageTransition } from "@/lib/pageTransitionController";

import styles from "./page.module.scss";

export default function WorksPage() {
  const rootRef = useRef(null);
  const isLeavingRef = useRef(false);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    isLeavingRef.current = false;

    const ctx = gsap.context(() => {
      const textPanel = rootRef.current.querySelector("[data-works-text-panel]");
      const worksPanel = rootRef.current.querySelector("[data-works-panel]");
      const titleNode = rootRef.current.querySelector("[data-works-title]");
      const textBody = rootRef.current.querySelector("[data-works-text-body]");
      const backStrip = rootRef.current.querySelector("[data-works-back]");
      const blocks = textBody ? Array.from(textBody.children) : [];

      gsap.set(textPanel, { autoAlpha: 1 });
      gsap.set(worksPanel, { autoAlpha: 0.76 });
      gsap.set([titleNode, ...blocks], { autoAlpha: 0, yPercent: 16 });
      gsap.set(backStrip, { autoAlpha: 0, yPercent: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.to(
        worksPanel,
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

  const handleMoreClick = async (workId) => {
    if (isLeavingRef.current) {
      return;
    }

    isLeavingRef.current = true;
    await coverPageTransition();
    router.push(`/works/more/${encodeURIComponent(workId ?? WORKS_ITEMS[0].id)}`);
  };

  return (
    <main className={shellStyles.page} ref={rootRef}>
      <InnerPageMobileHeader
        headerClassName={shellStyles.mobileHeader}
        overlayClassName={shellStyles.mobileOverlayFixed}
        transitionLockRef={isLeavingRef}
      />

      <section
        className={`${shellStyles.textPanel} ${styles.textPanel}`}
        aria-labelledby="works-title"
        data-works-text-panel
      >
        <div className={shellStyles.textScroll}>
          <div className={shellStyles.textContent}>
            <h1 id="works-title" className={shellStyles.title} data-works-title>
              Works
            </h1>

            <div className={shellStyles.textBody} data-works-text-body>
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
                  Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${shellStyles.backStrip} ${styles.desktopBackStrip}`} data-works-back>
          <TransitionBackLink
            href="/"
            className={shellStyles.backLink}
            arrowClassName={shellStyles.backArrow}
            transitionLockRef={isLeavingRef}
          />
        </div>
      </section>

      <section className={styles.worksPanel} aria-label="Works slider" data-works-panel>
        <div className={`${styles.slider} ${styles.desktopSlider}`}>
          <WorksCarousel
            items={WORKS_ITEMS}
            onMore={handleMoreClick}
          />
        </div>

        <div className={styles.mobileList} aria-label="Works list">
          {WORKS_ITEMS.map((item, index) => (
            <WorkSliderItem
              key={`work-mobile-${index}`}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              title={item.title}
              description={item.description}
              moreWorkId={item.id}
              onMore={handleMoreClick}
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
