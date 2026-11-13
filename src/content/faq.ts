export type Faq = { q: string; a: string; sources: string[] };

export const faq: Faq[] = [
  {
    q: "I found a lump. Does that mean I have cancer?",
    a: "Not necessarily. Most breast lumps are not cancer. But a new lump should always be checked by a healthcare professional, because it cannot be judged by touch.",
    sources: ["nhsSymptoms", "nci"],
  },
  {
    q: "Can this website tell me if I have breast cancer?",
    a: "No. This site provides general education only. Only a clinician who examines you and reviews your tests can diagnose or exclude breast cancer.",
    sources: ["who"],
  },
  {
    q: "At what age should I start screening?",
    a: "It depends on your country, your age, your personal and family history, and your own risk. We do not give a universal answer. Ask your doctor or your national screening programme.",
    sources: ["who", "nciScreening"],
  },
  {
    q: "Does a mammogram hurt or is it dangerous?",
    a: "A mammogram compresses the breast briefly, which can be uncomfortable for some people. It uses a small dose of radiation, and screening programmes weigh this against the benefits. Talk to your clinician if you have concerns.",
    sources: ["nhsScreening", "nciScreening"],
  },
  {
    q: "Can men get breast cancer?",
    a: "Yes, though it is rare. WHO states about 0.5 to 1% of breast cancers occur in men. Men should seek assessment for any new chest or breast change.",
    sources: ["who", "nciMale"],
  },
  {
    q: "Can I prevent breast cancer?",
    a: "Not completely. Being active, limiting alcohol and keeping a healthy weight may lower risk, but cannot guarantee prevention. No supplement or food has been proven to prevent or cure it.",
    sources: ["who", "nciRisk"],
  },
  {
    q: "Is a breast self-exam the same as screening?",
    a: "No. Knowing how your breasts normally look and feel helps you notice changes, but it cannot replace screening or a medical assessment, and it cannot rule out cancer.",
    sources: ["nhs", "acs"],
  },
  {
    q: "I have been called back after a mammogram. Should I panic?",
    a: "Being called back does not mean you have cancer. Many people called back do not. It means more pictures or tests are needed. It is natural to be worried, and you can ask the clinic to explain the next steps.",
    sources: ["nhsScreening", "nciScreening"],
  },
  {
    q: "Can I use this website to find a doctor?",
    a: "The Support page lists organisations that provide official information. It is not a complete or verified directory of doctors or hospitals. Your local health authority or your own doctor can direct you to local services.",
    sources: ["who"],
  },
  {
    q: "Do you store the answers I give in the quiz or the next-steps tool?",
    a: "No. Everything you choose stays in your own browser tab and is not sent anywhere. When you close or refresh the page, it is gone.",
    sources: [],
  },
];
