import { getAllChapterSlugs } from "@/data/chapters";
import ChapterContent from "./ChapterContent";

export function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export default function ChapterPage() {
  return <ChapterContent />;
}
