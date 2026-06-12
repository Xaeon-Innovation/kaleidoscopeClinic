import { MetadataRoute } from "next";
import { getAllTreatmentSeoContent } from "@/lib/treatments/getTreatmentSeoContent";
import { getSiteBaseUrl } from "@/lib/seo/site";

const LEGAL_LAST_MODIFIED = "2026-06-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteBaseUrl();
  const treatmentEntries = getAllTreatmentSeoContent().map((t) => ({
    url: `${base}/treatments/${t.slug}`,
    lastModified: t.lastModified,
    priority: 0.8,
  }));

  return [
    { url: `${base}/`, lastModified: LEGAL_LAST_MODIFIED, priority: 1.0 },
    { url: `${base}/about`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.7 },
    {
      url: `${base}/treatments`,
      lastModified: LEGAL_LAST_MODIFIED,
      priority: 0.9,
    },
    ...treatmentEntries,
    { url: `${base}/contact`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.7 },
    { url: `${base}/referral`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.6 },
    { url: `${base}/book`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.8 },
    { url: `${base}/privacy`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.3 },
    { url: `${base}/terms`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.3 },
    {
      url: `${base}/accessibility`,
      lastModified: LEGAL_LAST_MODIFIED,
      priority: 0.3,
    },
    { url: `${base}/cookies`, lastModified: LEGAL_LAST_MODIFIED, priority: 0.3 },
  ];
}
