"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

import styles from "@/app/page.module.scss";
import { coverPageTransition, revealPageTransition } from "@/lib/pageTransitionController";

export default function LandingNavigation({ brand, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isIntroPending, setIsIntroPending] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef(null);
  const topBarRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const topBar = topBarRef.current;
    const footer = footerRef.current;
    const menuLinks = header ? header.querySelectorAll(`.${styles.menuLink}`) : [];
    const menuLinksArray = Array.from(menuLinks);
    let fadeTimeline = null;
    const isMobileViewport =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    const hasHeader = Boolean(header);
    const hasTopBar = Boolean(topBar);
    const hasFooter = Boolean(footer);

    if (hasHeader || hasTopBar || hasFooter) {
      if (hasHeader && !isMobileViewport) {
        gsap.set(header, { autoAlpha: 0 });
      }

      if (hasTopBar && isMobileViewport) {
        gsap.set(topBar, { autoAlpha: 0 });
      }

      if (hasFooter) {
        gsap.set(footer, { autoAlpha: 0 });
      }

      if (menuLinksArray.length) {
        gsap.set(menuLinksArray, { autoAlpha: 0 });
      }

      setIsIntroPending(false);

      fadeTimeline = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
        onComplete: () => {
          const clearTargets = [header, topBar, footer, ...menuLinksArray].filter(Boolean);

          if (clearTargets.length) {
            gsap.set(clearTargets, {
              clearProps: "opacity,visibility,transform",
            });
          }
        },
      });

      if (hasHeader && !isMobileViewport) {
        fadeTimeline.to(
          header,
          {
            autoAlpha: 1,
            duration: 0.72,
            delay: 0.2,
          },
          0,
        );
      }

      if (hasTopBar && isMobileViewport) {
        fadeTimeline.to(
          topBar,
          {
            autoAlpha: 1,
            duration: 1,
            delay: 0.2,
          },
          0,
        );
      }

      if (menuLinksArray.length) {
        fadeTimeline.to(
          menuLinksArray,
          {
            autoAlpha: 1,
            duration: 0.82,
          },
          0.1,
        );
      }

      if (hasFooter) {
        fadeTimeline.to(
          footer,
          {
            autoAlpha: 1,
            duration: 0.72,
          },
          0.24,
        );
      }
    }

    revealPageTransition({ duration: 0.9, delay: 0.02 });

    return () => {
      if (fadeTimeline) {
        fadeTimeline.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const media = window.matchMedia("(min-width: 769px)");
    const onChange = (event) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
    } else {
      media.addListener(onChange);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavigationClick = async (event, item) => {
    if (!item?.href || item.href === "#") {
      closeMenu();
      return;
    }

    if (!item.href.startsWith("/")) {
      closeMenu();
      return;
    }

    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      closeMenu();
      return;
    }

    if (pathname === item.href) {
      event.preventDefault();
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    await coverPageTransition();
    router.push(item.href);
  };

  const normalizedItems = items.map((item) => {
    if (typeof item === "string") {
      return { label: item, href: "#" };
    }

    return item;
  });

  return (
    <>
      <header
        className={styles.header}
        ref={headerRef}
        style={isIntroPending ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <div className={styles.topBar} ref={topBarRef}>
          <p className={`${styles.signature} ${styles.signatureMobile}`}>{brand}</p>

          <button
            type="button"
            className={`${styles.burgerButton} ${isOpen ? styles.burgerButtonOpen : ""}`}
            aria-controls="mobile-main-menu"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <span className={styles.burgerIcon} aria-hidden="true">
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </span>
          </button>
        </div>

        <nav className={styles.menu} aria-label="Main menu">
          {normalizedItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={styles.menuLink}
              onClick={(event) => handleNavigationClick(event, item)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <nav
          id="mobile-main-menu"
          className={styles.mobileMenu}
          aria-label="Mobile menu"
        >
          {normalizedItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}-mobile`}
              href={item.href}
              className={styles.mobileMenuLink}
              onClick={(event) => handleNavigationClick(event, item)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <footer
        className={styles.footer}
        ref={footerRef}
        style={isIntroPending ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <p className={`${styles.signature} ${styles.signatureDesktop}`}>{brand}</p>
      </footer>
    </>
  );
}
