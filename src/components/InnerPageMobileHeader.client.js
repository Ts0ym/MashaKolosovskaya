"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import homeStyles from "@/app/page.module.scss";
import { coverPageTransition } from "@/lib/pageTransitionController";

const DEFAULT_ITEMS = [
  { label: "Biography", href: "/biography" },
  { label: "Works", href: "/works" },
  { label: "Studio", href: "/studio" },
  { label: "Shop", href: "#" },
  { label: "Contacts", href: "/contacts" },
];

export default function InnerPageMobileHeader({
  brand = "Masha Kolosovskaya",
  items = DEFAULT_ITEMS,
  headerClassName,
  overlayClassName,
  transitionLockRef,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const localTransitionLockRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuId = `inner-mobile-menu-${(pathname || "page").replace(/[^a-z0-9_-]+/gi, "-")}`;

  const isTransitionLocked = () => {
    if (transitionLockRef) {
      return Boolean(transitionLockRef.current);
    }

    return localTransitionLockRef.current;
  };

  const setTransitionLocked = (value) => {
    if (transitionLockRef) {
      transitionLockRef.current = value;
      return;
    }

    localTransitionLockRef.current = value;
  };

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

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  const handleMenuLinkClick = async (event, href) => {
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

    if (!href || href === "#") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (!href.startsWith("/")) {
      closeMenu();
      return;
    }

    if (href === pathname) {
      event.preventDefault();
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    if (isTransitionLocked()) {
      return;
    }

    setTransitionLocked(true);
    await coverPageTransition();
    router.push(href);
  };

  return (
    <>
      <header className={headerClassName}>
        <div className={homeStyles.topBar}>
          <p className={`${homeStyles.signature} ${homeStyles.signatureMobile}`}>{brand}</p>

          <button
            type="button"
            className={`${homeStyles.burgerButton} ${isOpen ? homeStyles.burgerButtonOpen : ""}`}
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <span className={homeStyles.burgerIcon} aria-hidden="true">
              <span className={homeStyles.burgerLine} />
              <span className={homeStyles.burgerLine} />
              <span className={homeStyles.burgerLine} />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`${homeStyles.mobileOverlay} ${overlayClassName ?? ""} ${isOpen ? homeStyles.mobileOverlayOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <nav id={menuId} className={homeStyles.mobileMenu} aria-label="Mobile menu">
          {items.map((item) => (
            <Link
              key={`${item.label}-${item.href}-inner-mobile`}
              href={item.href}
              className={homeStyles.mobileMenuLink}
              onClick={(event) => handleMenuLinkClick(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
