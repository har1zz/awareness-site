export type Myth = {
  id: string;
  myth: string;
  fact: string;
  sources: string[];
};

export const myths: Myth[] = [
  {
    id: "every-lump",
    myth: "Every breast lump is cancer.",
    fact: "Most breast lumps turn out to be benign, for example cysts or fibroadenomas. But you cannot tell by touch, so any new lump should be checked by a healthcare professional.",
    sources: ["nhsSymptoms", "nci"],
  },
  {
    id: "family-history",
    myth: "Only people with a family history develop breast cancer.",
    fact: "Family history raises risk, but many people diagnosed have no known family history. Being female and getting older are the most important risk factors overall.",
    sources: ["who", "nciRisk"],
  },
  {
    id: "men",
    myth: "Men cannot get breast cancer.",
    fact: "Men have breast tissue and can develop breast cancer. It is rare: WHO states about 0.5 to 1% of breast cancers occur in men. Men should also get new breast or chest changes checked.",
    sources: ["who", "nciMale"],
  },
  {
    id: "self-check",
    myth: "If a self-check feels normal, I do not have breast cancer.",
    fact: "A self-check cannot rule out cancer. Some cancers cannot be felt, and screening tests such as mammography can find changes before they can be felt. Self-awareness does not replace screening or medical assessment.",
    sources: ["nhs", "acs"],
  },
  {
    id: "lifestyle",
    myth: "A healthy lifestyle guarantees I will not get breast cancer.",
    fact: "Being active, limiting alcohol and keeping a healthy weight may lower risk, but they cannot guarantee prevention. Many people who develop breast cancer have no modifiable risk factors.",
    sources: ["who", "nciRisk"],
  },
  {
    id: "mammogram-purpose",
    myth: "Screening mammograms and diagnostic tests are the same thing.",
    fact: "Screening is for people without symptoms. Diagnostic tests are used to investigate a symptom or an abnormal screening result and may include extra imaging or a biopsy. Only a biopsy can confirm whether a changed area is cancer.",
    sources: ["nciScreening", "nhsScreening"],
  },
  {
    id: "same-treatment",
    myth: "All breast cancers are treated the same way.",
    fact: "Treatment depends on type, stage, grade, hormone receptor and HER2 status, and the person's health and preferences. Two people with breast cancer may have very different treatment plans.",
    sources: ["nciTreatment", "who"],
  },
  {
    id: "pain",
    myth: "Breast cancer always causes pain.",
    fact: "A breast lump is often painless, and some breast cancers cause no symptoms at all. Breast pain does not confirm cancer and its absence does not rule it out. Any new or persistent change should be checked.",
    sources: ["nhsSymptoms", "who"],
  },
  {
    id: "alternative",
    myth: "Herbal remedies, supplements or special diets can replace medical treatment.",
    fact: "No alternative remedy has been shown to cure breast cancer. Delaying or replacing evidence-based treatment can be dangerous. Talk to your treatment team before using any supplement, as some can interfere with treatment.",
    sources: ["nciTreatment", "acs"],
  },
];
