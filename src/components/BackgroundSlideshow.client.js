"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import styles from "./BackgroundSlideshow.module.scss";

const HOLD_DURATION = 4.4;
const TRANSITION_DURATION = 1.2;
const BG_SHIFT = 14;
const BG_SCALE_IN = 1.06;
const BG_SCALE_ACTIVE = 1.02;

export default function BackgroundSlideshow({ images = [] }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let activeTimeline = null;
    let holdCall = null;
    let currentIndex = -1;
    let animating = false;

    const ctx = gsap.context(() => {
      const sections = Array.from(rootRef.current.querySelectorAll("[data-slide]"));
      const outerWrappers = Array.from(rootRef.current.querySelectorAll("[data-outer]"));
      const innerWrappers = Array.from(rootRef.current.querySelectorAll("[data-inner]"));
      const backgrounds = Array.from(rootRef.current.querySelectorAll("[data-bg]"));

      if (!sections.length) {
        return;
      }

      const wrapIndex = gsap.utils.wrap(0, sections.length);

      gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
      gsap.set(outerWrappers, { xPercent: 100 });
      gsap.set(innerWrappers, { xPercent: -100 });
      gsap.set(backgrounds, {
        xPercent: 0,
        scale: BG_SCALE_IN,
        transformOrigin: "50% 50%",
      });

      const scheduleNext = () => {
        if (sections.length < 2) {
          return;
        }

        holdCall = gsap.delayedCall(HOLD_DURATION, () => {
          if (!animating) {
            gotoSection(currentIndex + 1, 1);
          }
        });
      };

      const cutToSection = (rawIndex) => {
        const index = wrapIndex(rawIndex);
        const previousIndex = currentIndex;

        if (previousIndex >= 0) {
          gsap.set(sections[previousIndex], { autoAlpha: 0, zIndex: 0 });
        }

        gsap.set(outerWrappers[index], { xPercent: 0 });
        gsap.set(innerWrappers[index], { xPercent: 0 });
        gsap.set(backgrounds[index], { xPercent: 0, scale: BG_SCALE_ACTIVE });
        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
        currentIndex = index;
      };

      const gotoSection = (rawIndex, direction = 1) => {
        const index = wrapIndex(rawIndex);

        if (index === currentIndex || animating) {
          return;
        }

        if (holdCall) {
          holdCall.kill();
          holdCall = null;
        }

        animating = true;

        const fromLeft = direction < 0;
        const dFactor = fromLeft ? -1 : 1;
        const previousIndex = currentIndex;
        const targetSection = sections[index];

        gsap.set(targetSection, { autoAlpha: 1, zIndex: 2 });
        gsap.set(outerWrappers[index], { xPercent: 100 * dFactor });
        gsap.set(innerWrappers[index], { xPercent: -100 * dFactor });
        gsap.set(backgrounds[index], {
          xPercent: BG_SHIFT * dFactor,
          scale: BG_SCALE_IN,
        });

        activeTimeline = gsap.timeline({
          defaults: {
            duration: TRANSITION_DURATION,
            ease: "power1.inOut",
          },
          onComplete: () => {
            if (previousIndex >= 0) {
              gsap.set(sections[previousIndex], { autoAlpha: 0, zIndex: 0 });
            }

            gsap.set(targetSection, { zIndex: 1 });
            currentIndex = index;
            animating = false;
            activeTimeline = null;
            scheduleNext();
          },
        });

        if (previousIndex >= 0) {
          gsap.set(sections[previousIndex], { autoAlpha: 1, zIndex: 1 });

          activeTimeline.to(
            [outerWrappers[previousIndex], innerWrappers[previousIndex]],
            {
              xPercent: (wrapperIndex) =>
                wrapperIndex === 0 ? -100 * dFactor : 100 * dFactor,
              stagger: 0,
            },
            0,
          );

          activeTimeline.to(
            backgrounds[previousIndex],
            {
              xPercent: -BG_SHIFT * dFactor,
              scale: BG_SCALE_ACTIVE,
            },
            0,
          );
        }

        activeTimeline
          .to(
            [outerWrappers[index], innerWrappers[index]],
            {
              xPercent: 0,
              stagger: 0,
            },
            0,
          )
          .to(
            backgrounds[index],
            {
              xPercent: 0,
              scale: BG_SCALE_ACTIVE,
            },
            0,
          );
      };

      if (prefersReducedMotion) {
        cutToSection(0);

        if (sections.length > 1) {
          const tick = () => {
            holdCall = gsap.delayedCall(HOLD_DURATION, () => {
              cutToSection(currentIndex + 1);
              tick();
            });
          };

          tick();
        }

        return;
      }

      gotoSection(0, 1);
    }, rootRef);

    return () => {
      if (holdCall) {
        holdCall.kill();
      }

      if (activeTimeline) {
        activeTimeline.kill();
      }

      ctx.revert();
    };
  }, [images]);

  if (!images.length) {
    return (
      <div className={styles.root} aria-hidden="true">
        <section className={`${styles.section} ${styles.isVisible}`}>
          <div className={styles.outer}>
            <div className={styles.inner}>
              <div className={`${styles.bg} ${styles.fallback}`} />
            </div>
          </div>
        </section>
        <div className={styles.overlayVeil} />
        <div className={styles.overlayGlow} />
      </div>
    );
  }

  return (
    <div className={styles.root} aria-hidden="true" ref={rootRef}>
      {images.map((src, index) => (
        <section
          key={`${src}-${index}`}
          data-slide
          className={styles.section}
        >
          <div className={styles.outer} data-outer>
            <div className={styles.inner} data-inner>
              <div
                className={styles.bg}
                data-bg
                style={{ backgroundImage: `url("${src}")` }}
              />
            </div>
          </div>
        </section>
      ))}
      <div className={styles.overlayVeil} />
      <div className={styles.overlayGlow} />
    </div>
  );
}
