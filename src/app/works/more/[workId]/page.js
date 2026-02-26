import { notFound } from "next/navigation";

import WorksMorePageView from "@/components/WorksMorePageView.client";
import { WORKS_ITEMS, getWorkById, getWorksMoreSlides } from "@/data/works";

export function generateStaticParams() {
  return WORKS_ITEMS.map((item) => ({
    workId: item.id,
  }));
}

export const dynamicParams = false;

export default async function WorkMoreDetailPage({ params }) {
  const resolvedParams = await params;
  const workId = resolvedParams?.workId;
  const work = getWorkById(workId);

  if (!work) {
    notFound();
  }

  const slides = getWorksMoreSlides(workId);

  return <WorksMorePageView items={slides} workTitle={work.title} />;
}
