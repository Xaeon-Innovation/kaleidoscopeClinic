import type { CaseDoc } from "./types";

const IMAGE_FOLDER = "before and after cases";

function publicImagePath(fileName: string) {
  return `/images/${encodeURIComponent(IMAGE_FOLDER)}/${fileName}`;
}

function casePair(index: number): Pick<
  CaseDoc,
  "beforeImageUrl" | "afterImageUrl"
> {
  return {
    beforeImageUrl: publicImagePath(`before${index}.jpeg`),
    afterImageUrl: publicImagePath(`after${index}.jpeg`),
  };
}

/** Home page before/after carousel (shown when Firestore has no published cases). */
export function defaultHomeCases(): CaseDoc[] {
  return Array.from({ length: 12 }, (_, i) => {
    const index = i + 1;
    return {
      title: "",
      treatmentType: "",
      labels: [],
      ...casePair(index),
      ordering: index * 10,
      published: true,
    };
  });
}
