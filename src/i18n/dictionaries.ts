import type { Locale } from "./config";

/**
 * Interface (UI) strings only: menus, buttons, notices.
 *
 * IMPORTANT: The Urdu and Arabic strings below are UNREVIEWED translations of
 * short interface text. They have NOT been checked by a professional medical
 * translator. Educational/medical page bodies are English-only in this release
 * and the site says so on every translated page. Before launch, have a
 * qualified translator review ur and ar (see docs/LAUNCH-CHECKLIST.md).
 */
export type Dictionary = {
  meta: { reviewedTranslation: boolean };
  skipToContent: string;
  language: string;
  menu: string;
  closeMenu: string;
  breadcrumbs: string;
  home: string;
  nav: {
    about: string;
    signs: string;
    risk: string;
    guide: string;
    screening: string;
    treatment: string;
    myths: string;
    quiz: string;
    tool: string;
    support: string;
    stories: string;
    videos: string;
    contribute: string;
    account: string;
    resources: string;
    faq: string;
    sources: string;
    contact: string;
    search: string;
    learn: string;
    interact: string;
    community: string;
    more: string;
  };
  hero: {
    title: string;
    text: string;
    cta1: string;
    cta2: string;
    cta3: string;
  };
  disclaimer: string;
  englishOnlyNotice: string;
  machineTranslationNotice: string;
  clinicalReviewPending: string;
  lastDrafted: string;
  sourcesHeading: string;
  relatedHeading: string;
  emergency: string;
  footer: {
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    payments: string;
    medicalDisclaimer: string;
    accessibility: string;
    credits: string;
    noTracking: string;
    operator: string;
  };
  quiz: {
    start: string;
    level: string;
    easy: string;
    intermediate: string;
    advanced: string;
    all: string;
    question: string;
    of: string;
    check: string;
    next: string;
    finish: string;
    correct: string;
    incorrect: string;
    score: string;
    review: string;
    retake: string;
    yourAnswer: string;
    correctAnswer: string;
    certificate: string;
    certificateName: string;
    print: string;
    noStorage: string;
  };
  tool: {
    start: string;
    back: string;
    restart: string;
  };
  search: { placeholder: string; button: string; noResults: string; results: string };
};

const en: Dictionary = {
  meta: { reviewedTranslation: true },
  skipToContent: "Skip to main content",
  language: "Language",
  menu: "Menu",
  closeMenu: "Close menu",
  breadcrumbs: "Breadcrumb",
  home: "Home",
  nav: {
    about: "About Breast Cancer",
    signs: "Signs and Symptoms",
    risk: "Risk Factors and Prevention",
    guide: "Breast Health Guide",
    screening: "Screening and Diagnosis",
    treatment: "Treatment and Recovery",
    myths: "Myths vs. Facts",
    quiz: "Awareness Quiz",
    tool: "What Should I Do Next?",
    support: "Get Help and Find Support",
    stories: "Stories and Community",
    videos: "Doctor Awareness Videos",
    contribute: "Contribute as a Healthcare Professional",
    account: "Account",
    resources: "Campaigns and Resources",
    faq: "Frequently Asked Questions",
    sources: "Medical Sources and References",
    contact: "Contact Us",
    search: "Search",
    learn: "Learn",
    interact: "Test and Explore",
    community: "Community",
    more: "More",
  },
  hero: {
    title: "Knowledge Changes Lives. Awareness Starts Here.",
    text: "Learn about breast health, understand the warning signs, explore trusted medical information, and discover how we can support one another through awareness and education.",
    cta1: "Learn About Breast Cancer",
    cta2: "Understand the Warning Signs",
    cta3: "Find Medical Support",
  },
  disclaimer:
    "This website provides educational information and is not a substitute for professional medical advice, diagnosis, or treatment. If you notice a new or concerning breast change, seek medical evaluation. For personal medical questions, consult a qualified healthcare professional.",
  englishOnlyNotice: "",
  machineTranslationNotice: "",
  clinicalReviewPending:
    "Editorial status: this page was drafted from public information published by the World Health Organization, the U.S. National Cancer Institute, the American Cancer Society and the UK NHS. It has not yet been reviewed by a qualified clinician. Do not rely on it for personal medical decisions.",
  lastDrafted: "Drafted",
  sourcesHeading: "Sources",
  relatedHeading: "Related topics",
  emergency:
    "If you have severe symptoms, trouble breathing, or feel unsafe, contact your local emergency number or nearest emergency department now.",
  footer: {
    legal: "Legal and policies",
    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    cookies: "Cookie Policy",
    payments: "Payments and Refunds",
    medicalDisclaimer: "Medical Disclaimer",
    accessibility: "Accessibility",
    credits: "Image and Content Credits",
    noTracking:
      "This site does not use advertising or analytics cookies and loads nothing from third-party trackers.",
    operator: "Operated by",
  },
  quiz: {
    start: "Start quiz",
    level: "Difficulty",
    easy: "Easy",
    intermediate: "Intermediate",
    advanced: "Advanced",
    all: "All levels",
    question: "Question",
    of: "of",
    check: "Check answer",
    next: "Next question",
    finish: "See results",
    correct: "Correct",
    incorrect: "Not quite",
    score: "Your score",
    review: "Review your answers",
    retake: "Retake the quiz",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    certificate: "Completion certificate",
    certificateName: "Name for the certificate (optional)",
    print: "Print certificate",
    noStorage:
      "Your answers stay in your browser tab. We do not save, send or track them.",
  },
  tool: { start: "Start", back: "Back", restart: "Start over" },
  search: {
    placeholder: "Search topics, e.g. lump, screening, risk",
    button: "Search",
    noResults: "No results found. Try a simpler word or browse the topics below.",
    results: "results",
  },
};

const ur: Dictionary = {
  meta: { reviewedTranslation: false },
  skipToContent: "مرکزی مواد پر جائیں",
  language: "زبان",
  menu: "مینو",
  closeMenu: "مینو بند کریں",
  breadcrumbs: "راستے کی نشاندہی",
  home: "ہوم",
  nav: {
    about: "چھاتی کے سرطان کے بارے میں",
    signs: "علامات",
    risk: "خطرے کے عوامل اور بچاؤ",
    guide: "چھاتی کی صحت کی رہنمائی",
    screening: "اسکریننگ اور تشخیص",
    treatment: "علاج اور صحت یابی",
    myths: "غلط فہمیاں اور حقائق",
    quiz: "آگاہی کوئز",
    tool: "اب مجھے کیا کرنا چاہیے؟",
    support: "مدد اور سپورٹ تلاش کریں",
    stories: "کہانیاں اور کمیونٹی",
    videos: "ڈاکٹروں کی آگاہی ویڈیوز",
    contribute: "طبی ماہر کے طور پر حصہ ڈالیں",
    account: "اکاؤنٹ",
    resources: "مہمات اور وسائل",
    faq: "اکثر پوچھے جانے والے سوالات",
    sources: "طبی ذرائع اور حوالہ جات",
    contact: "رابطہ کریں",
    search: "تلاش",
    learn: "سیکھیں",
    interact: "آزمائیں اور جانیں",
    community: "کمیونٹی",
    more: "مزید",
  },
  hero: {
    title: "علم زندگیاں بدلتا ہے۔ آگاہی یہیں سے شروع ہوتی ہے۔",
    text: "چھاتی کی صحت کے بارے میں جانیں، انتباہی علامات کو سمجھیں، قابلِ اعتماد طبی معلومات دیکھیں، اور جانیں کہ آگاہی اور تعلیم کے ذریعے ہم ایک دوسرے کی مدد کیسے کر سکتے ہیں۔",
    cta1: "چھاتی کے سرطان کے بارے میں جانیں",
    cta2: "انتباہی علامات سمجھیں",
    cta3: "طبی مدد تلاش کریں",
  },
  disclaimer:
    "یہ ویب سائٹ صرف تعلیمی معلومات فراہم کرتی ہے اور پیشہ ورانہ طبی مشورے، تشخیص یا علاج کا متبادل نہیں ہے۔ اگر آپ کو چھاتی میں کوئی نئی یا تشویشناک تبدیلی نظر آئے تو طبی معائنہ کروائیں۔ ذاتی طبی سوالات کے لیے کسی مستند طبی ماہر سے رجوع کریں۔",
  englishOnlyNotice:
    "اس صفحے کا مکمل متن فی الحال صرف انگریزی میں دستیاب ہے۔ طبی مواد کا اردو ترجمہ ماہرین کے جائزے کے بعد شامل کیا جائے گا۔",
  machineTranslationNotice:
    "اس صفحے کے مینو اور بٹن کا ترجمہ مشینی مدد سے کیا گیا ہے اور اس کا کسی طبی ماہر مترجم نے جائزہ نہیں لیا۔",
  clinicalReviewPending:
    "ادارتی حیثیت: یہ صفحہ عالمی ادارہ صحت، امریکی نیشنل کینسر انسٹی ٹیوٹ، امریکن کینسر سوسائٹی اور برطانوی این ایچ ایس کی عوامی معلومات سے تیار کیا گیا مسودہ ہے۔ کسی مستند معالج نے ابھی اس کا جائزہ نہیں لیا۔ ذاتی طبی فیصلوں کے لیے اس پر انحصار نہ کریں۔",
  lastDrafted: "مسودہ تیار",
  sourcesHeading: "ذرائع",
  relatedHeading: "متعلقہ موضوعات",
  emergency:
    "اگر آپ کو شدید علامات ہوں، سانس لینے میں دشواری ہو، یا آپ خود کو غیر محفوظ محسوس کریں تو فوراً اپنے علاقے کے ہنگامی نمبر پر رابطہ کریں یا قریبی ایمرجنسی میں جائیں۔",
  footer: {
    legal: "قانونی معلومات اور پالیسیاں",
    privacy: "پرائیویسی پالیسی",
    terms: "شرائط و ضوابط",
    cookies: "کوکی پالیسی",
    payments: "ادائیگیاں اور رقم کی واپسی",
    medicalDisclaimer: "طبی اعلانِ لاتعلقی",
    accessibility: "رسائی",
    credits: "تصاویر اور مواد کا حوالہ",
    noTracking:
      "یہ سائٹ اشتہاری یا تجزیاتی کوکیز استعمال نہیں کرتی اور کسی تیسرے فریق کے ٹریکر سے کچھ لوڈ نہیں کرتی۔",
    operator: "چلانے والا",
  },
  quiz: {
    start: "کوئز شروع کریں",
    level: "مشکل کی سطح",
    easy: "آسان",
    intermediate: "درمیانی",
    advanced: "اعلیٰ",
    all: "تمام سطحیں",
    question: "سوال",
    of: "از",
    check: "جواب جانچیں",
    next: "اگلا سوال",
    finish: "نتائج دیکھیں",
    correct: "درست",
    incorrect: "درست نہیں",
    score: "آپ کا اسکور",
    review: "اپنے جوابات کا جائزہ لیں",
    retake: "کوئز دوبارہ دیں",
    yourAnswer: "آپ کا جواب",
    correctAnswer: "درست جواب",
    certificate: "تکمیل کا سرٹیفکیٹ",
    certificateName: "سرٹیفکیٹ کے لیے نام (اختیاری)",
    print: "سرٹیفکیٹ پرنٹ کریں",
    noStorage:
      "آپ کے جوابات صرف آپ کے براؤزر ٹیب میں رہتے ہیں۔ ہم انہیں محفوظ، ارسال یا ٹریک نہیں کرتے۔",
  },
  tool: { start: "شروع کریں", back: "واپس", restart: "دوبارہ شروع کریں" },
  search: {
    placeholder: "موضوعات تلاش کریں، مثلاً گلٹی، اسکریننگ، خطرہ",
    button: "تلاش کریں",
    noResults: "کوئی نتیجہ نہیں ملا۔ آسان لفظ آزمائیں یا نیچے دیے گئے موضوعات دیکھیں۔",
    results: "نتائج",
  },
};

const ar: Dictionary = {
  meta: { reviewedTranslation: false },
  skipToContent: "انتقل إلى المحتوى الرئيسي",
  language: "اللغة",
  menu: "القائمة",
  closeMenu: "إغلاق القائمة",
  breadcrumbs: "مسار التنقل",
  home: "الرئيسية",
  nav: {
    about: "عن سرطان الثدي",
    signs: "العلامات والأعراض",
    risk: "عوامل الخطر والوقاية",
    guide: "دليل صحة الثدي",
    screening: "الفحص والتشخيص",
    treatment: "العلاج والتعافي",
    myths: "الخرافات والحقائق",
    quiz: "اختبار التوعية",
    tool: "ماذا أفعل الآن؟",
    support: "الحصول على المساعدة والدعم",
    stories: "القصص والمجتمع",
    videos: "فيديوهات توعوية من الأطباء",
    contribute: "المساهمة كمهني رعاية صحية",
    account: "الحساب",
    resources: "الحملات والموارد",
    faq: "الأسئلة الشائعة",
    sources: "المصادر والمراجع الطبية",
    contact: "اتصل بنا",
    search: "بحث",
    learn: "تعلّم",
    interact: "اختبر واستكشف",
    community: "المجتمع",
    more: "المزيد",
  },
  hero: {
    title: "المعرفة تغيّر الحياة. والتوعية تبدأ من هنا.",
    text: "تعرّف على صحة الثدي، وافهم علامات التحذير، واطّلع على معلومات طبية موثوقة، واكتشف كيف يمكننا دعم بعضنا بعضًا من خلال التوعية والتعليم.",
    cta1: "تعرّف على سرطان الثدي",
    cta2: "افهم علامات التحذير",
    cta3: "ابحث عن الدعم الطبي",
  },
  disclaimer:
    "يقدّم هذا الموقع معلومات تثقيفية وليس بديلًا عن المشورة الطبية المتخصصة أو التشخيص أو العلاج. إذا لاحظت تغيّرًا جديدًا أو مقلقًا في الثدي فاطلب تقييمًا طبيًا. وللأسئلة الطبية الشخصية استشر أخصائي رعاية صحية مؤهلًا.",
  englishOnlyNotice:
    "النص الكامل لهذه الصفحة متاح حاليًا باللغة الإنجليزية فقط. ستُضاف الترجمة العربية للمحتوى الطبي بعد مراجعتها من مختصين.",
  machineTranslationNotice:
    "تُرجمت القوائم والأزرار في هذه الصفحة بمساعدة آلية ولم يراجعها مترجم طبي مختص.",
  clinicalReviewPending:
    "الحالة التحريرية: أُعدّت هذه الصفحة كمسودة من معلومات عامة نشرتها منظمة الصحة العالمية والمعهد الوطني للسرطان في الولايات المتحدة والجمعية الأمريكية للسرطان وهيئة الخدمات الصحية البريطانية. لم يراجعها بعد طبيب مؤهل. لا تعتمد عليها في قراراتك الطبية الشخصية.",
  lastDrafted: "تاريخ الإعداد",
  sourcesHeading: "المصادر",
  relatedHeading: "مواضيع ذات صلة",
  emergency:
    "إذا كانت لديك أعراض شديدة أو صعوبة في التنفس أو شعرت بعدم الأمان، فاتصل برقم الطوارئ المحلي أو توجّه إلى أقرب قسم طوارئ فورًا.",
  footer: {
    legal: "المعلومات القانونية والسياسات",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    cookies: "سياسة ملفات تعريف الارتباط",
    payments: "المدفوعات والاسترداد",
    medicalDisclaimer: "إخلاء المسؤولية الطبية",
    accessibility: "إمكانية الوصول",
    credits: "حقوق الصور والمحتوى",
    noTracking:
      "لا يستخدم هذا الموقع ملفات تعريف ارتباط إعلانية أو تحليلية ولا يحمّل أي شيء من متتبّعات الأطراف الثالثة.",
    operator: "يُدار بواسطة",
  },
  quiz: {
    start: "ابدأ الاختبار",
    level: "مستوى الصعوبة",
    easy: "سهل",
    intermediate: "متوسط",
    advanced: "متقدم",
    all: "كل المستويات",
    question: "السؤال",
    of: "من",
    check: "تحقّق من الإجابة",
    next: "السؤال التالي",
    finish: "عرض النتائج",
    correct: "صحيح",
    incorrect: "غير صحيح",
    score: "نتيجتك",
    review: "راجع إجاباتك",
    retake: "أعد الاختبار",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    certificate: "شهادة إتمام",
    certificateName: "الاسم على الشهادة (اختياري)",
    print: "اطبع الشهادة",
    noStorage:
      "تبقى إجاباتك داخل علامة تبويب المتصفح. لا نحفظها ولا نرسلها ولا نتتبّعها.",
  },
  tool: { start: "ابدأ", back: "رجوع", restart: "ابدأ من جديد" },
  search: {
    placeholder: "ابحث في المواضيع، مثل: كتلة، فحص، خطر",
    button: "بحث",
    noResults: "لا توجد نتائج. جرّب كلمة أبسط أو تصفّح المواضيع أدناه.",
    results: "نتائج",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ur, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
