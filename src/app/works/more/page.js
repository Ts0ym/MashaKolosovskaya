import { redirect } from "next/navigation";

import { WORKS_ITEMS } from "@/data/works";

export default function WorksMoreIndexPage() {
  const fallbackId = WORKS_ITEMS[0]?.id ?? "work-1";
  redirect(`/works/more/${fallbackId}`);
}
