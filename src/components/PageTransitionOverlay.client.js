"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { registerPageTransitionController } from "@/lib/pageTransitionController";

const COVER_DURATION = 0.75;
const REVEAL_DURATION = 0.9;
const EASE = "power2.inOut";

export default function PageTransitionOverlay() {
  const curtainRef = useRef(null);
  const isCoveredRef = useRef(false);
  const activeTweenRef = useRef(null);

  useLayoutEffect(() => {
    if (!curtainRef.current) {
      return undefined;
    }

    gsap.set(curtainRef.current, {
      xPercent: 100,
      autoAlpha: 1,
      pointerEvents: "none",
      force3D: true,
    });

    const stopActiveTween = () => {
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
        activeTweenRef.current = null;
      }
    };

    const controller = {
      isCovered() {
        return isCoveredRef.current;
      },

      cover({ duration = COVER_DURATION } = {}) {
        stopActiveTween();

        return new Promise((resolve) => {
          gsap.set(curtainRef.current, { xPercent: 100, autoAlpha: 1 });

          activeTweenRef.current = gsap.to(curtainRef.current, {
            xPercent: 0,
            duration,
            ease: EASE,
            onComplete: () => {
              isCoveredRef.current = true;
              activeTweenRef.current = null;
              resolve();
            },
          });
        });
      },

      reveal({ duration = REVEAL_DURATION, delay = 0 } = {}) {
        if (!isCoveredRef.current) {
          return Promise.resolve();
        }

        stopActiveTween();

        return new Promise((resolve) => {
          activeTweenRef.current = gsap.to(curtainRef.current, {
            xPercent: -100,
            duration,
            delay,
            ease: EASE,
            onComplete: () => {
              isCoveredRef.current = false;
              gsap.set(curtainRef.current, { xPercent: 100 });
              activeTweenRef.current = null;
              resolve();
            },
          });
        });
      },
    };

    const unregister = registerPageTransitionController(controller);

    return () => {
      unregister();
      stopActiveTween();
    };
  }, []);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#ffffff",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
