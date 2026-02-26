import { readdir } from "node:fs/promises";
import path from "node:path";

import BackgroundSlideshow from "@/components/BackgroundSlideshow.client";
import LandingNavigation from "@/components/LandingNavigation.client";

import styles from "./page.module.scss";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MENU_ITEMS = [
  { label: "Biography", href: "/biography" },
  { label: "Works", href: "/works" },
  { label: "Studio", href: "/studio" },
  { label: "Shop", href: "#" },
  { label: "Contacts", href: "/contacts" },
];
const BRAND_NAME = "Masha Kolosovskaya";

async function getBackgroundImages() {
  const publicDir = path.join(process.cwd(), "public");
  const preferredDir = path.join(publicDir, "Images", "Main");
  const fallbackDir = path.join(publicDir, "Images");

  const tryReadImages = async (absoluteDir, publicPrefix) => {
    try {
      const entries = await readdir(absoluteDir, { withFileTypes: true });

      return entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, "ru"))
        .map((fileName) => encodeURI(`${publicPrefix}/${fileName}`));
    } catch {
      return [];
    }
  };

  const preferredImages = await tryReadImages(preferredDir, "/Images/Main");

  if (preferredImages.length) {
    return preferredImages;
  }

  return tryReadImages(fallbackDir, "/Images");
}

export default async function HomePage() {
  const images = await getBackgroundImages();

  return (
    <main className={styles.page}>
      <BackgroundSlideshow images={images} />

      <div className={styles.content}>
        <LandingNavigation brand={BRAND_NAME} items={MENU_ITEMS} />
      </div>
    </main>
  );
}
