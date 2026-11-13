/**
 * "What Should I Do Next?" decision flow.
 * Educational next steps only. Never diagnoses, never gives risk percentages,
 * never says someone is fine or cancer-free. Nothing is stored or sent.
 */
export type Outcome = {
  kind: "urgent" | "warn" | "info";
  title: string;
  body: string[];
  links: { slug: string; label: string }[];
};

export type Step = {
  id: string;
  question: string;
  help?: string;
  choices: { label: string; next: string }[]; // next = step id or "out:<outcome id>"
};

export const outcomes: Record<string, Outcome> = {
  urgent: {
    kind: "urgent",
    title: "Get medical care today",
    body: [
      "A sudden red, swollen, hot or painful breast, a high fever, trouble breathing, or feeling very unwell needs prompt medical attention. Contact your local emergency number, an urgent care service or your nearest emergency department.",
      "This tool cannot tell what is causing your symptoms. A clinician needs to see you.",
    ],
    links: [{ slug: "support", label: "Find support and official health information" }],
  },
  assess: {
    kind: "warn",
    title: "Arrange a medical assessment soon",
    body: [
      "A new or unexplained breast change should be assessed by a healthcare professional as soon as you reasonably can. Many changes are not cancer, but it cannot be judged online, and a self-check cannot rule anything out.",
      "Do not wait for your next routine screening. If you have already been told a change is harmless but it continues, grows or worries you, go back and ask again.",
    ],
    links: [
      { slug: "appointment-preparation", label: "Prepare for your appointment" },
      { slug: "signs-and-symptoms", label: "Read about signs and symptoms" },
      { slug: "support", label: "Find support and official health information" },
    ],
  },
  screening: {
    kind: "info",
    title: "Ask about screening that applies to you",
    body: [
      "Screening recommendations differ by country, age, personal history and family history. Ask your doctor, or your national or regional screening programme, what is recommended for you and when.",
      "Screening is for people without symptoms. If you notice a breast change, do not wait for a screening appointment.",
    ],
    links: [
      { slug: "screening-and-diagnosis", label: "Read about screening and diagnosis" },
      { slug: "appointment-preparation", label: "Prepare for your appointment" },
      { slug: "support", label: "Find support and official health information" },
    ],
  },
  family: {
    kind: "info",
    title: "Talk to a doctor about your family history",
    body: [
      "A family history of breast, ovarian or related cancers can change which screening or advice is right for you. Write down who was affected and at what age, and ask your doctor whether a risk assessment or genetic counselling referral is appropriate.",
      "Do not wait if you also notice a breast change. Have that checked.",
    ],
    links: [
      { slug: "risk-factors-and-prevention", label: "Read about risk factors" },
      { slug: "appointment-preparation", label: "Prepare for your appointment" },
      { slug: "support", label: "Find support and official health information" },
    ],
  },
  followup: {
    kind: "info",
    title: "Follow up with the team that gave you the result",
    body: [
      "Being called back or told a result is abnormal does not mean you have cancer, but follow-up tests matter. Contact the clinic, attend your appointments and ask them to explain the next steps and timing.",
      "If you are waiting and anxious, it is reasonable to ask how long results will take and who to call.",
    ],
    links: [
      { slug: "screening-and-diagnosis", label: "What happens after an abnormal result" },
      { slug: "appointment-preparation", label: "Prepare your questions" },
      { slug: "living-with-breast-cancer", label: "Support while you wait" },
    ],
  },
  diagnosed: {
    kind: "info",
    title: "Support for you or someone you care about",
    body: [
      "A diagnosis is a lot to take in. Your treatment team is the right source for decisions about care. Do not start, stop or change treatment based on information on a website.",
      "Support from counsellors, nurses, peers and family can make a real difference, for the person with cancer and for caregivers.",
    ],
    links: [
      { slug: "treatment-and-recovery", label: "Overview of treatment" },
      { slug: "living-with-breast-cancer", label: "Living with breast cancer" },
      { slug: "appointment-preparation", label: "Questions to ask your team" },
    ],
  },
  learn: {
    kind: "info",
    title: "Keep learning",
    body: [
      "Understanding the basics helps you recognise changes and make informed decisions. If you ever notice something new or worrying, see a healthcare professional rather than relying on this site.",
    ],
    links: [
      { slug: "about-breast-cancer", label: "About breast cancer" },
      { slug: "breast-health-guide", label: "Breast health guide" },
      { slug: "quiz", label: "Try the awareness quiz" },
    ],
  },
};

export const steps: Record<string, Step> = {
  start: {
    id: "start",
    question: "Do you have any of these right now: sudden red, swollen, hot or very painful breast, high fever, trouble breathing, or feeling very unwell?",
    choices: [
      { label: "Yes, one or more of these", next: "out:urgent" },
      { label: "No", next: "topic" },
    ],
  },
  topic: {
    id: "topic",
    question: "What would you like to learn about?",
    help: "Pick the closest match. You can start over at any time.",
    choices: [
      { label: "I noticed a new lump or thickened area", next: "out:assess" },
      { label: "A change in the size, shape or skin of my breast", next: "out:assess" },
      { label: "A change in my nipple", next: "out:assess" },
      { label: "Nipple discharge", next: "out:assess" },
      { label: "Breast pain", next: "out:assess" },
      { label: "A screening question and I have no symptoms", next: "out:screening" },
      { label: "Family history or inherited risk", next: "out:family" },
      { label: "I was called back or had an abnormal result", next: "out:followup" },
      { label: "Me or someone I care about has been diagnosed", next: "out:diagnosed" },
      { label: "I just want to learn", next: "out:learn" },
    ],
  },
};
