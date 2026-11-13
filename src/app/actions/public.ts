"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getPublicSupabase, supabaseConfigured } from "@/lib/supabase";
import { dbMessage, isBot, localeOf, optional, tick, validate, type FormState } from "@/lib/form";
import { languages, storyCategories, values } from "@/lib/options";

const text = (min: number, max: number, what: string) =>
  z.string().trim().min(min, `${what}: at least ${min} characters.`).max(max, `${what}: at most ${max} characters.`);

const storySchema = z.object({
  category: z.enum(values(storyCategories), { message: "Choose who you are sharing as." }),
  title: text(3, 140, "Title"),
  body: text(100, 6000, "Your story"),
  display_name: optional(60),
  content_warning: optional(200),
  language: z.enum(values(languages), { message: "Choose the language of your story." }),
  consent_publish: tick("Please confirm you agree to your story being published."),
  consent_real: tick("Please confirm this is a true account of your own or a family member's experience."),
});

export async function submitStory(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return { error: "Story submissions are not switched on for this site yet." };
  const v = validate(storySchema, fd);
  if (!v.ok) return v.state;
  if (isBot(fd)) redirect(`/${locale}/stories?m=story_sent`);
  const d = v.data;
  const { error } = await getPublicSupabase().from("stories").insert({
    category: d.category,
    title: d.title,
    body: d.body,
    display_name: d.display_name || null,
    is_anonymous: !d.display_name,
    content_warning: d.content_warning || null,
    language: d.language,
    consent_publish: true,
    consent_real: true,
  });
  if (error) return { error: dbMessage(error), values: v.raw };
  redirect(`/${locale}/stories?m=story_sent`);
}

const messageSchema = z.object({
  topic: z.enum(["correction", "accessibility", "privacy", "feedback", "other"], { message: "Choose a topic." }),
  name: optional(80),
  email: z
    .string()
    .trim()
    .max(200)
    .refine((s) => s === "" || z.email().safeParse(s).success, { message: "Enter a valid email address, or leave it empty." }),
  message: text(10, 2000, "Message"),
  consent: tick("Please confirm you agree to us reading your message."),
});

export async function submitMessage(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return { error: "The contact form is not switched on for this site yet." };
  const v = validate(messageSchema, fd);
  if (!v.ok) return v.state;
  if (isBot(fd)) redirect(`/${locale}/contact?m=message_sent`);
  const d = v.data;
  const { error } = await getPublicSupabase().from("messages").insert({
    topic: d.topic,
    name: d.name || null,
    email: d.email || null,
    message: d.message,
    consent: true,
  });
  if (error) return { error: dbMessage(error), values: v.raw };
  redirect(`/${locale}/contact?m=message_sent`);
}
