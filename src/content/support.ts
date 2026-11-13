/**
 * Support directory.
 *
 * RULES: only organisations whose existence and official website are well
 * established. No phone numbers or addresses are listed, because they change
 * and have not been individually verified. Each entry has `verified: false`
 * until the owner has opened the site and recorded the date.
 * Never add an entry you have not confirmed from the organisation's own site.
 */
export type Org = {
  name: string;
  scope: string;
  country: string;
  url: string;
  about: string;
  verified: false | string; // ISO date once checked by a person
};

export const orgs: Org[] = [
  {
    name: "World Health Organization (WHO)",
    scope: "Global",
    country: "International",
    url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
    about: "Global public-health information on breast cancer and the Global Breast Cancer Initiative.",
    verified: "2026-10-28",
  },
  {
    name: "U.S. National Cancer Institute",
    scope: "Information",
    country: "United States",
    url: "https://www.cancer.gov/types/breast",
    about: "Detailed patient information on breast cancer, treatment and clinical trials.",
    verified: false,
  },
  {
    name: "American Cancer Society",
    scope: "Information and support",
    country: "United States",
    url: "https://www.cancer.org/cancer/types/breast-cancer.html",
    about: "Patient information and links to support services.",
    verified: false,
  },
  {
    name: "NHS (UK National Health Service)",
    scope: "Information",
    country: "United Kingdom",
    url: "https://www.nhs.uk/conditions/breast-cancer/",
    about: "Symptoms, screening and treatment information for the UK.",
    verified: false,
  },
  {
    name: "Shaukat Khanum Memorial Cancer Hospital & Research Centre",
    scope: "Cancer hospital",
    country: "Pakistan",
    url: "https://shaukatkhanum.org.pk/",
    about: "A cancer hospital in Pakistan with centres in several cities. Check the official website for locations, services and how to apply for care.",
    verified: false,
  },
];
