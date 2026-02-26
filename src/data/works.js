const DEFAULT_DESCRIPTION =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";

function createPlaceholderSlides(workId, title, description, count = 8) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${workId}-slide-${index + 1}`,
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: `${title} placeholder image ${index + 1}`,
    title,
    description,
  }));
}

// Main content file for the Works section.
// Edit items here:
// - title / image / description (cards on /works)
// - moreSlides[] (gallery on /works/more/[workId])
export const WORKS_ITEMS = [
  {
    id: "work-1",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 1",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-1", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-2",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 2",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-2", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-3",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 3",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-3", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-4",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 4",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-4", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-5",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 5",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-5", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-6",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 6",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-6", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-7",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 7",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-7", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
  {
    id: "work-8",
    imageSrc: "/Images/Works/1.jpg",
    imageAlt: "Work preview 8",
    title: "Ischiya Suzdal 2025",
    description: DEFAULT_DESCRIPTION,
    moreSlides: createPlaceholderSlides("work-8", "Ischiya Suzdal 2025", DEFAULT_DESCRIPTION, 8),
  },
];

export function getWorkById(workId) {
  return WORKS_ITEMS.find((item) => item.id === workId) ?? null;
}

export function getWorksMoreSlides(workId) {
  const work = getWorkById(workId);
  if (!work) {
    return [];
  }

  return work.moreSlides;
}
