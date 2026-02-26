"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

import WorkSliderItem from "@/components/WorkSliderItem";
import styles from "./WorksCarousel.module.scss";

const BASE_SPEED = 0.88;
const MIN_SPEED = -14;
const MAX_SPEED = 16;
const WHEEL_IMPULSE_MULTIPLIER = 0.5;
const RETURN_TO_BASE_DELAY = 0.22;
const VELOCITY_LERP = 0.22;
const DRAG_RELEASE_DAMPING = 0.35;

export default function WorksCarousel({
  items,
  isGalleryMode = false,
  itemVariant = "default",
  showMore = true,
  onMore,
}) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const sequenceRef = useRef(null);
  const galleryModeRef = useRef(isGalleryMode);

  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    galleryModeRef.current = isGalleryMode;

    const track = trackRef.current;
    if (!track || !isGalleryMode) {
      return;
    }

    const copyNodes = Array.from(track.querySelectorAll("[data-work-copy]"));
    if (!copyNodes.length) {
      return;
    }

    gsap.set(copyNodes, { opacity: 1 });
  }, [isGalleryMode]);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      return undefined;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstSequence = sequenceRef.current;

    if (!viewport || !track || !firstSequence) {
      return undefined;
    }

    const xSetter = gsap.quickSetter(track, "x", "px");
    const state = {
      offset: 0,
      sequenceWidth: 0,
      velocity: BASE_SPEED,
      targetVelocity: BASE_SPEED,
      isHoverPaused: false,
      isDragging: false,
      activePointerId: null,
      lastPointerX: 0,
      lastMoveTime: 0,
    };

    let returnToBaseCall = null;
    let viewportRect = null;

    const copyNodes = Array.from(track.querySelectorAll("[data-work-copy]"));
    const copyOpacitySetters = copyNodes.map((node) => gsap.quickSetter(node, "opacity"));

    const updateViewportRect = () => {
      viewportRect = viewport.getBoundingClientRect();
    };

    const updateCopyFade = () => {
      if (!viewportRect || !copyNodes.length) {
        return;
      }

      if (galleryModeRef.current) {
        copyOpacitySetters.forEach((setOpacity) => setOpacity(1));
        return;
      }

      const fadeZone = Math.max(48, Math.min(viewportRect.width * 0.14, 180));
      const leftEdge = viewportRect.left;
      const rightEdge = viewportRect.right;

      copyNodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        let opacity = 1;

        if (centerX < leftEdge + fadeZone) {
          opacity = gsap.utils.clamp(0, 1, (centerX - leftEdge) / fadeZone);
        } else if (centerX > rightEdge - fadeZone) {
          opacity = gsap.utils.clamp(0, 1, (rightEdge - centerX) / fadeZone);
        }

        copyOpacitySetters[index](opacity);
      });
    };

    const getBaseSpeed = () => (state.isHoverPaused || state.isDragging ? 0 : BASE_SPEED);

    const wrapOffset = (value) => {
      if (!state.sequenceWidth) {
        return 0;
      }

      return gsap.utils.wrap(0, state.sequenceWidth, value);
    };

    const applyTransform = () => {
      xSetter(-wrapOffset(state.offset));
      updateCopyFade();
    };

    const measure = () => {
      const width = firstSequence.getBoundingClientRect().width;

      if (!width) {
        return;
      }

      const prevWidth = state.sequenceWidth;
      const hadWidth = prevWidth > 0;
      const prevVisibleOffset = hadWidth ? gsap.utils.wrap(0, prevWidth, state.offset) : 0;

      if (hadWidth && Math.abs(width - prevWidth) > 0.5) {
        const phase = prevVisibleOffset / prevWidth;
        state.offset = phase * width;
      }

      state.sequenceWidth = width;
      state.offset = wrapOffset(state.offset);
      updateViewportRect();
      applyTransform();
    };

    const scheduleReturnToBase = () => {
      if (returnToBaseCall) {
        returnToBaseCall.kill();
      }

      returnToBaseCall = gsap.delayedCall(RETURN_TO_BASE_DELAY, () => {
        state.targetVelocity = getBaseSpeed();
      });
    };

    const onWheel = (event) => {
      event.preventDefault();

      const delta = event.deltaX || event.deltaY;
      const impulse = delta * WHEEL_IMPULSE_MULTIPLIER;

      state.targetVelocity = gsap.utils.clamp(
        MIN_SPEED,
        MAX_SPEED,
        state.targetVelocity + impulse,
      );

      scheduleReturnToBase();
    };

    const onPointerEnter = (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      state.isHoverPaused = true;

      if (returnToBaseCall) {
        returnToBaseCall.kill();
        returnToBaseCall = null;
      }

      state.targetVelocity = 0;
    };

    const onPointerLeave = (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      state.isHoverPaused = false;

      if (returnToBaseCall) {
        returnToBaseCall.kill();
        returnToBaseCall = null;
      }

      state.targetVelocity = getBaseSpeed();
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const interactiveTarget = event.target instanceof Element
        ? event.target.closest("button, a, input, textarea, select, label")
        : null;

      if (interactiveTarget) {
        return;
      }

      state.isDragging = true;
      state.activePointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastMoveTime = performance.now();
      state.targetVelocity = 0;

      if (returnToBaseCall) {
        returnToBaseCall.kill();
        returnToBaseCall = null;
      }

      if (typeof viewport.setPointerCapture === "function") {
        viewport.setPointerCapture(event.pointerId);
      }
    };

    const onPointerMove = (event) => {
      if (!state.isDragging || event.pointerId !== state.activePointerId) {
        return;
      }

      const dx = event.clientX - state.lastPointerX;
      state.lastPointerX = event.clientX;
      state.offset -= dx;

      const now = performance.now();
      const elapsed = Math.max(1, now - state.lastMoveTime);
      state.lastMoveTime = now;

      // Keep momentum aligned with the last drag direction.
      state.velocity = (-dx / elapsed) * (1000 / 60);
      state.targetVelocity = 0;

      applyTransform();
      event.preventDefault();
    };

    const endPointerDrag = (event) => {
      if (!state.isDragging || event.pointerId !== state.activePointerId) {
        return;
      }

      state.isDragging = false;
      state.activePointerId = null;
      state.velocity *= DRAG_RELEASE_DAMPING;
      state.targetVelocity = getBaseSpeed();

      if (typeof viewport.releasePointerCapture === "function") {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore if capture is already released by the browser.
        }
      }
    };

    const tick = () => {
      if (!state.sequenceWidth) {
        return;
      }

      const dt = gsap.ticker.deltaRatio(60);
      const lerp = Math.min(1, VELOCITY_LERP * dt);

      state.velocity += (state.targetVelocity - state.velocity) * lerp;
      state.offset += state.velocity * dt;

      applyTransform();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(firstSequence);

    const cardNodes = firstSequence.querySelectorAll("[data-work-item]");

    gsap.set(cardNodes, { autoAlpha: 0, x: 18 });
    gsap.to(cardNodes, {
      autoAlpha: 1,
      x: 0,
      duration: 0.68,
      ease: "power2.out",
      stagger: 0.06,
      delay: 0.18,
      clearProps: "opacity,visibility,transform",
    });

    measure();
    updateViewportRect();
    updateCopyFade();
    gsap.ticker.add(tick);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endPointerDrag);
    viewport.addEventListener("pointercancel", endPointerDrag);

    return () => {
      if (returnToBaseCall) {
        returnToBaseCall.kill();
      }

      resizeObserver.disconnect();
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerenter", onPointerEnter);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endPointerDrag);
      viewport.removeEventListener("pointercancel", endPointerDrag);
      gsap.ticker.remove(tick);
    };
  }, [items]);

  return (
    <div
      className={`${styles.viewport} ${isGalleryMode ? styles.viewportGallery : ""}`}
      ref={viewportRef}
      aria-label="Works slider"
      data-works-carousel-viewport
    >
      <div className={`${styles.track} ${isGalleryMode ? styles.trackGallery : ""}`} ref={trackRef}>
        <div
          className={`${styles.sequence} ${isGalleryMode ? styles.sequenceGallery : ""}`}
          ref={sequenceRef}
        >
          {items.map((item, index) => (
            <WorkSliderItem
              key={`work-seq-a-${index}`}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              title={item.title}
              description={item.description}
              moreWorkId={item.id}
              variant={itemVariant}
              showMore={showMore}
              isGalleryMode={isGalleryMode}
              onMore={onMore}
            />
          ))}
        </div>

        <div
          className={`${styles.sequence} ${isGalleryMode ? styles.sequenceGallery : ""}`}
          aria-hidden="true"
        >
          {duplicatedItems.slice(items.length).map((item, index) => (
            <WorkSliderItem
              key={`work-seq-b-${index}`}
              imageSrc={item.imageSrc}
              imageAlt=""
              title={item.title}
              description={item.description}
              moreWorkId={item.id}
              variant={itemVariant}
              showMore={showMore}
              isGalleryMode={isGalleryMode}
              onMore={onMore}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
