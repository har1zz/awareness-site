import type { ContentPage } from "./types";

/**
 * Educational pages (English). Drafted from public guidance by WHO, NCI, ACS
 * and NHS. NOT yet reviewed by a clinician: see site.clinicalReview.
 * Deliberately avoids: invented statistics, universal screening schedules,
 * diet/supplement claims, and any diagnosis-like statements.
 */
export const pages: ContentPage[] = [
  {
    slug: "about-breast-cancer",
    navKey: "about",
    title: "About Breast Cancer",
    description:
      "Plain-language introduction to what breast cancer is, how it develops, the main types, and how it is described by stage and grade.",
    lead: "Breast cancer starts when cells in breast tissue change and grow in an uncontrolled way. This page explains the basics in plain language.",
    sections: [
      {
        heading: "What breast cancer is",
        blocks: [
          {
            type: "p",
            text: "Cancer begins when cells stop following the body's normal rules for growing and dying. In breast cancer, these changed cells start in the tissue of the breast. They can form a lump, and some can spread into nearby tissue or, in some cases, to other parts of the body.",
          },
          {
            type: "p",
            text: "The World Health Organization (WHO) reports that breast cancer is the most common cancer in women in most countries of the world. It is a large public health issue, but outcomes are better when it is found and treated early.",
          },
          {
            type: "notice",
            kind: "info",
            text: "WHO fact sheet (dated 3 July 2026) estimates about 2.4 million women were diagnosed with breast cancer and about 694,000 died of it globally in 2024, using data from the IARC Global Cancer Observatory. These are estimates and are revised over time.",
          },
        ],
      },
      {
        heading: "Basic breast anatomy",
        blocks: [
          {
            type: "ul",
            items: [
              "Lobules are small glands that can make milk.",
              "Ducts are thin tubes that carry milk toward the nipple.",
              "Fatty and connective tissue surrounds these structures and gives the breast its shape.",
              "Lymph nodes and vessels, including those in the armpit (axilla), are part of the body's drainage and immune system. Breast cancer can spread to nearby lymph nodes.",
            ],
          },
        ],
      },
      {
        heading: "Benign changes versus cancer",
        blocks: [
          {
            type: "p",
            text: "Many breast changes are not cancer. Cysts, fibroadenomas, infections and normal hormonal changes can all cause lumps or tenderness. These are called benign conditions. However, you cannot tell by looking or feeling whether a change is benign, so a new or unusual change should be checked by a healthcare professional.",
          },
        ],
      },
      {
        heading: "Common types",
        blocks: [
          {
            type: "ul",
            items: [
              "Ductal carcinoma in situ (DCIS): abnormal cells are inside the milk ducts and have not spread into surrounding breast tissue. This is called non-invasive or stage 0.",
              "Invasive ductal carcinoma: starts in a duct and has grown into surrounding tissue. It is the most common type of invasive breast cancer.",
              "Invasive lobular carcinoma: starts in the lobules and has grown into surrounding tissue.",
              "Less common types exist, including inflammatory breast cancer, which can cause redness and swelling of the breast and can progress quickly.",
            ],
          },
        ],
      },
      {
        heading: "Hormone receptors and HER2 (an introduction)",
        blocks: [
          {
            type: "p",
            text: "Doctors test breast cancer cells for certain features. Cells may have receptors for the hormones oestrogen and progesterone (hormone receptor positive). Some cells make too much of a protein called HER2 (HER2 positive). Cancers without these features are described differently. These results help doctors choose treatments that are more likely to work, so two people with breast cancer can be treated quite differently.",
          },
        ],
      },
      {
        heading: "Stage and grade",
        blocks: [
          {
            type: "ul",
            items: [
              "Stage describes how large the cancer is and whether it has spread to lymph nodes or other parts of the body. Stages are commonly numbered 0 to IV.",
              "Grade describes how abnormal the cancer cells look under a microscope and gives a clue to how fast they may grow.",
            ],
          },
          {
            type: "p",
            text: "Your care team uses stage, grade and receptor results together. Only they can tell you what these mean for an individual person.",
          },
        ],
      },
      {
        heading: "Breast cancer can affect men",
        blocks: [
          {
            type: "p",
            text: "Men have a small amount of breast tissue and can develop breast cancer. WHO states that about 0.5 to 1% of breast cancers occur in men. Men who notice a lump or other change in the chest area should seek medical assessment just as women should.",
          },
        ],
      },
      {
        heading: "Why it can happen without an obvious cause",
        blocks: [
          {
            type: "p",
            text: "Many people who develop breast cancer have no risk factor they could have changed, other than being female and getting older. Developing breast cancer is not a sign that someone did something wrong.",
          },
        ],
      },
    ],
    sources: ["who", "nci", "acs", "nhs", "nciMale"],
    related: ["signs-and-symptoms", "risk-factors-and-prevention", "screening-and-diagnosis"],
  },

  {
    slug: "signs-and-symptoms",
    navKey: "signs",
    title: "Signs and Symptoms",
    description:
      "Possible breast changes that deserve medical assessment, and why you should not wait for a routine appointment.",
    lead: "Knowing what changes to look out for helps you act early. Most changes are not cancer, but only a healthcare professional can tell.",
    urgentBanner: true,
    sections: [
      {
        heading: "Changes that should be checked",
        blocks: [
          {
            type: "ul",
            items: [
              "A new lump or thickened area in the breast or armpit (it is often painless, but may not be).",
              "A change in the size or shape of the breast.",
              "Changes to the skin of the breast, such as dimpling, puckering, redness or a texture like orange peel.",
              "A nipple that turns inward (newly inverted), or other new nipple or areola changes such as a rash, scaling or crusting.",
              "Nipple discharge that is new, especially if it is bloody or happens without squeezing.",
              "Swelling or a lump in the armpit or around the collarbone.",
              "Any other new breast change that is unusual for you or does not go away.",
            ],
          },
        ],
      },
      {
        heading: "What these changes do and do not mean",
        blocks: [
          {
            type: "ul",
            items: [
              "These changes often have causes other than cancer, such as cysts, infections or hormonal changes.",
              "Some breast cancers cause no noticeable symptoms at all, especially early on. Having no symptoms does not mean there is no cancer.",
              "Pain alone is not a reliable sign either way. Breast pain does not confirm cancer and its absence does not rule it out.",
            ],
          },
          {
            type: "notice",
            kind: "warn",
            text: "Do not wait for a self-check result or your next routine screening appointment. If you notice a new or concerning change, arrange to see a healthcare professional as soon as you reasonably can.",
          },
        ],
      },
      {
        heading: "When to seek urgent care",
        blocks: [
          {
            type: "p",
            text: "Seek urgent medical care if a breast becomes suddenly red, swollen, hot or very painful, especially with fever or if you feel very unwell. This can be an infection or another condition that needs prompt treatment, and a clinician needs to assess it. Rapid changes of this kind can also occasionally be caused by rarer types of breast cancer.",
          },
        ],
      },
      {
        heading: "What to do next",
        blocks: [
          {
            type: "ol",
            items: [
              "Note what you noticed, where it is, and when you first saw it.",
              "Book an appointment with a doctor, nurse practitioner or your local breast or primary care clinic.",
              "Take our appointment checklist (linked below) and ask for further tests if you are still worried.",
              "If you are told it is not cancer but the change persists or grows, go back and ask for it to be looked at again.",
            ],
          },
        ],
      },
    ],
    sources: ["who", "nhsSymptoms", "nci", "acs"],
    related: ["breast-health-guide", "appointment-preparation", "screening-and-diagnosis"],
  },

  {
    slug: "risk-factors-and-prevention",
    navKey: "risk",
    title: "Risk Factors and Prevention",
    description:
      "Established breast cancer risk factors, which ones can and cannot be changed, and evidence-based ways to lower risk.",
    lead: "A risk factor is something that raises the chance of a disease. Having one does not mean you will develop breast cancer, and having none does not mean you will not.",
    sections: [
      {
        heading: "Risk factors you cannot change",
        blocks: [
          {
            type: "ul",
            items: [
              "Being female and increasing age (risk rises as people get older).",
              "A personal history of breast cancer or certain non-cancerous breast conditions.",
              "A family history of breast cancer, especially in close relatives or at a young age.",
              "Inherited changes in genes such as BRCA1, BRCA2 and PALB2, which can greatly increase risk.",
              "Dense breast tissue (seen on a mammogram).",
              "Earlier radiation treatment to the chest.",
              "Some reproductive and hormonal factors, such as starting periods at a young age or reaching menopause late.",
            ],
          },
        ],
      },
      {
        heading: "Risk factors you may be able to influence",
        blocks: [
          {
            type: "ul",
            items: [
              "Drinking alcohol: risk goes up with the amount consumed.",
              "Excess body weight, especially after menopause.",
              "Low physical activity.",
              "Tobacco use.",
              "Use of combined hormone therapy after menopause (discuss benefits and risks with your doctor).",
            ],
          },
          {
            type: "notice",
            kind: "info",
            text: "WHO notes that many breast cancers occur in people with no modifiable risk factor beyond being female and older. Breast cancer is never the fault of the person who develops it.",
          },
        ],
      },
      {
        heading: "Ways that may lower risk",
        blocks: [
          {
            type: "ul",
            items: [
              "Keeping physically active.",
              "Limiting or avoiding alcohol.",
              "Maintaining a healthy body weight.",
              "Not smoking.",
              "Breastfeeding, where this is possible and your choice, is associated with a lower risk.",
              "Knowing your family history and sharing it with your doctor.",
            ],
          },
          {
            type: "notice",
            kind: "warn",
            text: "A healthy lifestyle may lower risk but cannot guarantee that breast cancer will not happen. No food, supplement, detox, herbal product or home remedy has been shown to prevent or cure breast cancer.",
          },
        ],
      },
      {
        heading: "For people at higher risk",
        blocks: [
          {
            type: "p",
            text: "If several relatives have had breast or ovarian cancer, or a relative was diagnosed young, ask your doctor whether a referral for genetic counselling or a risk assessment is appropriate. Some people at high risk are offered earlier or different screening, or medicines or surgery that reduce risk. These are specialist decisions with benefits and downsides and should be made with a qualified clinician.",
          },
        ],
      },
    ],
    sources: ["who", "nciRisk", "nci", "acs", "nhs"],
    related: ["screening-and-diagnosis", "breast-health-guide", "about-breast-cancer"],
  },

  {
    slug: "breast-health-guide",
    navKey: "guide",
    title: "Breast Health Guide",
    description:
      "How to become familiar with how your breasts normally look and feel, and how to describe a change to a clinician.",
    lead: "Breast awareness means knowing what is normal for you so that you notice a change. It is not a test and does not replace screening or a medical assessment.",
    urgentBanner: true,
    sections: [
      {
        heading: "Get to know your normal",
        blocks: [
          {
            type: "p",
            text: "Breasts differ from person to person and change with age, periods, pregnancy, breastfeeding and menopause. One breast may be slightly larger than the other. The aim is simply to be familiar with your own pattern.",
          },
        ],
      },
      {
        heading: "What to look for",
        blocks: [
          {
            type: "ul",
            items: [
              "Look in a mirror with your arms by your sides, and then raised.",
              "Look for changes in size, shape, outline, skin texture or colour, and the position of the nipple.",
              "Feel each breast and the armpit area, using the pads of your fingers, for any new lump or thickened area. You can do this in the shower, lying down or whenever suits you.",
              "Notice any nipple discharge or new nipple changes.",
            ],
          },
          {
            type: "notice",
            kind: "warn",
            text: "A self-check cannot diagnose cancer and cannot rule it out. It does not replace recommended screening or an examination by a healthcare professional.",
          },
        ],
      },
      {
        heading: "How often?",
        blocks: [
          {
            type: "p",
            text: "There is no single correct schedule that suits everyone. The idea is to be aware of your breasts as part of everyday life, rather than to follow a rigid routine. If you find it helpful to pick a regular time, such as after your period, that is fine.",
          },
        ],
      },
      {
        heading: "Describing a change to a clinician",
        blocks: [
          {
            type: "ul",
            items: [
              "What you noticed, and in which breast and position.",
              "When you first noticed it and whether it has changed.",
              "Whether it changes during your menstrual cycle.",
              "Any family history of breast, ovarian or related cancers.",
              "Any medicines you take, including hormone therapy or contraception.",
            ],
          },
          {
            type: "p",
            text: "It is fine to bring a friend or family member, to write your questions down, and to ask the clinician to explain anything you do not understand.",
          },
        ],
      },
    ],
    sources: ["nhsSymptoms", "nhs", "acs", "who"],
    related: ["signs-and-symptoms", "appointment-preparation", "screening-and-diagnosis"],
  },

  {
    slug: "screening-and-diagnosis",
    navKey: "screening",
    title: "Screening and Diagnosis",
    description:
      "The difference between screening and diagnostic tests, common imaging methods, benefits and limits of screening, and what happens after an abnormal result.",
    lead: "Screening looks for breast cancer in people with no symptoms. Diagnostic tests investigate a symptom or an abnormal screening result.",
    sections: [
      {
        heading: "Screening versus diagnosis",
        blocks: [
          {
            type: "ul",
            items: [
              "Screening: tests offered to people without symptoms to find cancer early. It is a population approach, so it will not find every cancer.",
              "Diagnostic testing: tests used when someone has a symptom, a screening abnormality or a high-risk situation, to find out exactly what is going on.",
            ],
          },
          {
            type: "notice",
            kind: "info",
            text: "A website cannot confirm or exclude a diagnosis. Only a clinician who examines you and reviews your tests can do that.",
          },
        ],
      },
      {
        heading: "Common tests",
        blocks: [
          {
            type: "ul",
            items: [
              "Mammography: a low-dose X-ray of the breast. It is the main screening test used in many national programmes.",
              "Breast ultrasound: uses sound waves. It is often used to look more closely at a lump or an area seen on a mammogram, and can be useful in dense breasts or younger people.",
              "Breast MRI: uses magnets and radio waves. It may be recommended for some people at high risk or in specific situations.",
              "Clinical breast examination: an examination by a trained health professional.",
            ],
          },
        ],
      },
      {
        heading: "Screening recommendations differ",
        blocks: [
          {
            type: "p",
            text: "Recommendations about who should be screened, from what age and how often vary between countries and organisations, and depend on age, personal and family history and risk. WHO notes that mammography screening is generally recommended for women in their 50s and 60s, and it recommends screening where health systems are able to support it with follow-up and treatment. We do not give a single schedule on this website, because the right answer depends on you. Ask your doctor or your national or regional screening programme what applies to you.",
          },
        ],
      },
      {
        heading: "Benefits and limitations",
        blocks: [
          {
            type: "ul",
            items: [
              "Benefit: finding cancer earlier often means more treatment options and better outcomes.",
              "Limitation: screening can miss some cancers, particularly in dense breasts.",
              "Limitation: it can lead to false alarms (an abnormal result that turns out not to be cancer), which can cause anxiety and further tests.",
              "Limitation: it can sometimes find a cancer that would never have caused problems (overdiagnosis).",
              "Mammograms use a small dose of radiation.",
            ],
          },
        ],
      },
      {
        heading: "After an abnormal result",
        blocks: [
          {
            type: "p",
            text: "Being called back for more tests does not mean you have cancer. Many people called back do not have cancer. Further tests may include extra mammogram views, ultrasound, MRI or a biopsy.",
          },
        ],
      },
      {
        heading: "How diagnosis works",
        blocks: [
          {
            type: "ol",
            items: [
              "A medical history and physical examination.",
              "Imaging, for example a mammogram and/or ultrasound.",
              "A biopsy: a small sample of tissue is taken and examined by a pathologist. This is the way to confirm whether cancer is present.",
              "If cancer is found, further tests of the tissue (such as hormone receptor and HER2 status) and sometimes scans to work out the stage.",
            ],
          },
        ],
      },
      {
        heading: "Preparing for an appointment",
        blocks: [
          {
            type: "p",
            text: "See our appointment preparation checklist for tips on what to bring and which questions to ask.",
          },
        ],
      },
    ],
    sources: ["who", "nciScreening", "nhsScreening", "acs", "nci"],
    related: ["appointment-preparation", "treatment-and-recovery", "signs-and-symptoms"],
  },

  {
    slug: "treatment-and-recovery",
    navKey: "treatment",
    title: "Treatment and Recovery",
    description:
      "An overview of breast cancer treatments, how treatment is chosen, and support during and after treatment.",
    lead: "Treatment depends on the type of breast cancer, its stage, test results, your health and your preferences. This overview cannot tell you what is right for you.",
    sections: [
      {
        heading: "Main treatment approaches",
        blocks: [
          {
            type: "ul",
            items: [
              "Surgery: removing the cancer (breast-conserving surgery, often called lumpectomy) or the whole breast (mastectomy). Lymph nodes in the armpit may also be checked or removed. Reconstruction may be an option.",
              "Radiation therapy: high-energy rays to destroy remaining cancer cells, often after surgery.",
              "Chemotherapy: medicines that kill or slow growing cells, given before or after surgery depending on the case.",
              "Hormone (endocrine) therapy: for hormone receptor positive cancers, medicines that block or lower hormones that help the cancer grow.",
              "Targeted therapy: medicines aimed at specific features of cancer cells, for example HER2-targeted treatments.",
              "Immunotherapy: used in some situations and for some types of breast cancer.",
              "Clinical trials: research studies of new approaches. Taking part is voluntary and you can ask your team whether any are suitable.",
            ],
          },
          {
            type: "notice",
            kind: "warn",
            text: "Never start, stop or change prescribed treatment because of something you read on a website. Talk to your treatment team first.",
          },
        ],
      },
      {
        heading: "Side effects and practical issues",
        blocks: [
          {
            type: "p",
            text: "Treatments can have side effects, such as tiredness, nausea, hair loss, skin changes, joint aches, menopausal symptoms, or swelling in the arm (lymphoedema). Your team can often help manage these, so tell them about any new symptoms. Ask about effects on fertility before treatment starts if this matters to you.",
          },
        ],
      },
      {
        heading: "Supportive and palliative care",
        blocks: [
          {
            type: "p",
            text: "Supportive care helps with symptoms, side effects and emotional wellbeing at any stage. Palliative care focuses on comfort and quality of life, including for people living with advanced breast cancer, and can be provided alongside treatment.",
          },
        ],
      },
      {
        heading: "Follow-up and survivorship",
        blocks: [
          {
            type: "p",
            text: "After treatment, regular follow-up appointments check for side effects and for any return of the cancer. Many people also benefit from rehabilitation, physical activity guidance, and emotional support.",
          },
        ],
      },
    ],
    sources: ["nciTreatment", "who", "acs", "nhs"],
    related: ["living-with-breast-cancer", "appointment-preparation", "screening-and-diagnosis"],
  },

  {
    slug: "living-with-breast-cancer",
    navKey: "living",
    title: "Living with Breast Cancer",
    description:
      "Emotional and practical support for people with breast cancer, their families and caregivers.",
    lead: "A diagnosis affects the whole person and the people close to them. There is no right way to feel, and support is available.",
    sections: [
      {
        heading: "Emotions",
        blocks: [
          {
            type: "p",
            text: "Shock, fear, anger, sadness, numbness and even moments of hope are all common. These feelings can change from day to day. Talking to a counsellor, a support group, a spiritual advisor or a trusted friend can help. If your distress feels overwhelming, tell your care team or a doctor.",
          },
        ],
      },
      {
        heading: "Talking to family and friends",
        blocks: [
          {
            type: "ul",
            items: [
              "You decide who to tell, when and how much.",
              "Be specific when people offer help, for example lifts to appointments or meals.",
              "Children usually cope better with honest, age-appropriate explanations than with secrets.",
            ],
          },
        ],
      },
      {
        heading: "Practical matters",
        blocks: [
          {
            type: "ul",
            items: [
              "Ask your team about work, leave, travel to appointments and financial or social support that may be available where you live.",
              "Keep a folder or notebook for appointment notes, test results and questions.",
              "Ask your hospital whether it has a nurse specialist, social worker or patient navigator.",
            ],
          },
        ],
      },
      {
        heading: "For caregivers",
        blocks: [
          {
            type: "p",
            text: "Caring for someone with cancer can be exhausting. Look after your own sleep, food and breaks, accept help, and seek support for yourself too.",
          },
        ],
      },
    ],
    sources: ["acs", "nhs", "nci"],
    related: ["treatment-and-recovery", "appointment-preparation"],
  },

  {
    slug: "appointment-preparation",
    navKey: "appointment",
    title: "Appointment Preparation Checklist",
    description:
      "What to bring and what to ask when you see a healthcare professional about a breast change, a screening result or a diagnosis.",
    lead: "Appointments can feel rushed. A short list prepared in advance helps you get the most from the time.",
    sections: [
      {
        heading: "Before you go",
        blocks: [
          {
            type: "ul",
            items: [
              "Write down what you have noticed, when it started and whether it has changed.",
              "List your medicines and any hormone treatment or contraception.",
              "Note any family history of breast, ovarian, prostate or pancreatic cancer.",
              "Bring previous breast tests or reports if you have them.",
              "Consider bringing someone with you for support and to help remember what was said.",
            ],
          },
        ],
      },
      {
        heading: "Questions you may want to ask",
        blocks: [
          {
            type: "expander",
            summary: "About a breast change",
            items: [
              "What could be causing this?",
              "Which tests do I need and why?",
              "How and when will I get the results?",
              "What should I watch for, and when should I come back?",
            ],
          },
          {
            type: "expander",
            summary: "About screening",
            items: [
              "Based on my age and history, which screening applies to me?",
              "What are the benefits and limits of this test for me?",
              "When will I receive results, and what happens if the result is unclear?",
            ],
          },
          {
            type: "expander",
            summary: "After a diagnosis",
            items: [
              "What type and stage is my cancer, and what do the test results mean?",
              "What are my treatment options, and what do you recommend and why?",
              "What are the side effects and how will they be managed?",
              "Are there clinical trials I could join?",
              "Who can I contact between appointments?",
              "What support services are available?",
            ],
          },
        ],
      },
      {
        heading: "At the appointment",
        blocks: [
          {
            type: "ul",
            items: [
              "Ask the clinician to explain terms you do not understand.",
              "Write down the answers or ask whether you may record them.",
              "Ask for written information and what the next step is.",
            ],
          },
        ],
      },
      {
        heading: "Appointment reminders",
        blocks: [
          {
            type: "p",
            text: "This release does not store appointment dates or send reminders, because doing that safely would mean collecting health-related information. We suggest using your phone calendar or a paper diary. Print this page if you would like to take the checklist with you.",
          },
        ],
      },
    ],
    sources: ["nhs", "acs", "nci"],
    related: ["signs-and-symptoms", "screening-and-diagnosis", "treatment-and-recovery"],
  },
];

export function getPage(slug: string) {
  return pages.find((p) => p.slug === slug);
}
