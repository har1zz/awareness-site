export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "notice"; kind: "info" | "warn" | "urgent" | "ok"; text: string }
  | { type: "expander"; summary: string; items: string[] };

export type Section = { heading: string; blocks: Block[] };

export type ContentPage = {
  slug: string;
  navKey:
    | "about"
    | "signs"
    | "risk"
    | "guide"
    | "screening"
    | "treatment"
    | "appointment"
    | "living";
  title: string;
  description: string;
  lead: string;
  /** "symptom" pages get the stronger "seek assessment" banner */
  urgentBanner?: boolean;
  sections: Section[];
  sources: string[];
  related: string[];
};
