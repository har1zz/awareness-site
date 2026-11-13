/**
 * Reference registry. Every medical page and quiz question cites these by id.
 *
 * VERIFICATION STATUS: the WHO fact sheet was opened and read on 28 Oct 2026
 * (page showed "3 July 2026"). The other URLs are the organisations' standard
 * public pages, but they were NOT individually re-opened when this draft was
 * written. Run `npm run check:links` and have a clinician check the content
 * against each source before launch (docs/LAUNCH-CHECKLIST.md).
 */
export type Source = {
  id: string;
  org: string;
  title: string;
  url: string;
  note?: string;
};

export const sources: Record<string, Source> = {
  who: {
    id: "who",
    org: "World Health Organization",
    title: "Breast cancer (fact sheet)",
    url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
    note: "Read 28 Oct 2026; page dated 3 July 2026.",
  },
  whoGbci: {
    id: "whoGbci",
    org: "World Health Organization",
    title: "Global Breast Cancer Initiative",
    url: "https://www.who.int/initiatives/global-breast-cancer-initiative",
  },
  nci: {
    id: "nci",
    org: "U.S. National Cancer Institute",
    title: "Breast cancer: overview for patients",
    url: "https://www.cancer.gov/types/breast",
  },
  nciScreening: {
    id: "nciScreening",
    org: "U.S. National Cancer Institute",
    title: "Breast cancer screening (PDQ, patient version)",
    url: "https://www.cancer.gov/types/breast/patient/breast-screening-pdq",
  },
  nciTreatment: {
    id: "nciTreatment",
    org: "U.S. National Cancer Institute",
    title: "Breast cancer treatment (PDQ, patient version)",
    url: "https://www.cancer.gov/types/breast/patient/breast-treatment-pdq",
  },
  nciMale: {
    id: "nciMale",
    org: "U.S. National Cancer Institute",
    title: "Male breast cancer treatment (PDQ, patient version)",
    url: "https://www.cancer.gov/types/breast/patient/male-breast-treatment-pdq",
  },
  nciRisk: {
    id: "nciRisk",
    org: "U.S. National Cancer Institute",
    title: "Breast cancer risk in American women",
    url: "https://www.cancer.gov/types/breast/risk-fact-sheet",
  },
  acs: {
    id: "acs",
    org: "American Cancer Society",
    title: "About breast cancer",
    url: "https://www.cancer.org/cancer/types/breast-cancer.html",
  },
  nhs: {
    id: "nhs",
    org: "UK National Health Service (NHS)",
    title: "Breast cancer",
    url: "https://www.nhs.uk/conditions/breast-cancer/",
  },
  nhsSymptoms: {
    id: "nhsSymptoms",
    org: "UK National Health Service (NHS)",
    title: "Breast cancer: symptoms",
    url: "https://www.nhs.uk/conditions/breast-cancer/symptoms/",
  },
  nhsScreening: {
    id: "nhsScreening",
    org: "UK National Health Service (NHS)",
    title: "Breast screening (mammogram)",
    url: "https://www.nhs.uk/conditions/breast-cancer-screening/",
  },
};

export function getSources(ids: string[]): Source[] {
  return ids.map((id) => sources[id]).filter(Boolean);
}
