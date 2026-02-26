"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { coverPageTransition } from "@/lib/pageTransitionController";

export default function TransitionBackLink({
  href = "/",
  className,
  arrowClassName,
  transitionLockRef,
  label = "Back",
}) {
  const router = useRouter();
  const localLockRef = useRef(false);

  const isLocked = () => {
    if (transitionLockRef) {
      return Boolean(transitionLockRef.current);
    }

    return localLockRef.current;
  };

  const setLocked = (value) => {
    if (transitionLockRef) {
      transitionLockRef.current = value;
      return;
    }

    localLockRef.current = value;
  };

  const handleClick = async (event) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    if (!href || !href.startsWith("/")) {
      return;
    }

    if (isLocked()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setLocked(true);

    await coverPageTransition();
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      <Image
        src="/svg/Back.svg"
        alt=""
        aria-hidden="true"
        width={39}
        height={14}
        className={arrowClassName}
      />
      <span>{label}</span>
    </Link>
  );
}
