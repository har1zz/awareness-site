export const topics = [
  { value: "understanding", label: "Understanding breast cancer" },
  { value: "symptoms", label: "Signs and symptoms" },
  { value: "risk", label: "Risk factors and prevention" },
  { value: "screening", label: "Screening and diagnosis" },
  { value: "treatment", label: "Treatment and recovery" },
  { value: "living", label: "Living with breast cancer" },
  { value: "support", label: "Support for families and carers" },
  { value: "other", label: "Other" },
] as const;

export const languages = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu (اردو)" },
  { value: "ar", label: "Arabic (العربية)" },
  { value: "other", label: "Another language" },
] as const;

export const audiences = [
  { value: "public", label: "General public" },
  { value: "patients", label: "People with a diagnosis" },
  { value: "caregivers", label: "Family and carers" },
  { value: "professionals", label: "Healthcare professionals" },
] as const;

export const storyCategories = [
  { value: "patient", label: "I am a patient" },
  { value: "survivor", label: "I am a survivor" },
  { value: "caregiver", label: "I am a caregiver" },
  { value: "supporter", label: "I am a supporter" },
] as const;

export const serviceTypes = [
  "screening",
  "diagnosis",
  "treatment",
  "support",
  "information",
  "counselling",
  "other",
] as const;

export const label = (list: readonly { value: string; label: string }[], v: string) =>
  list.find((x) => x.value === v)?.label ?? v;

export const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((x) => x.value) as unknown as [string, ...string[]];
