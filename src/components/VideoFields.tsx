import { CheckField, SelectField, TextArea, TextField } from "./forms";
import { audiences, languages, topics } from "@/lib/options";

export type VideoDefaults = {
  title?: string;
  description?: string;
  topic?: string;
  language?: string;
  audience?: string;
  video_url?: string;
  transcript?: string;
  reference_links?: string;
  attribution?: string;
};

export function VideoFields({ d = {} }: { d?: VideoDefaults }) {
  return (
    <>
      <TextField name="title" label="Video title" required maxLength={140} minLength={5} defaultValue={d.title} />
      <TextArea
        name="description"
        label="Short description"
        required
        rows={3}
        minLength={20}
        maxLength={1000}
        defaultValue={d.description}
        hint="One or two sentences on what viewers will learn."
      />
      <SelectField name="topic" label="Topic" required options={[...topics]} defaultValue={d.topic} />
      <SelectField name="language" label="Language spoken in the video" required options={[...languages]} defaultValue={d.language} />
      <SelectField name="audience" label="Who is it for?" required options={[...audiences]} defaultValue={d.audience} />
      <TextField
        name="video_url"
        label="Video link"
        type="url"
        required
        maxLength={300}
        defaultValue={d.video_url}
        hint="A public or unlisted YouTube or Vimeo link, starting with https://. Upload your video there first. We do not host video files."
      />
      <TextArea
        name="transcript"
        label="Transcript or captions"
        required
        rows={10}
        minLength={100}
        maxLength={20000}
        defaultValue={d.transcript}
        hint="Paste the full text of what is said. This is shown to viewers who cannot hear the video and is checked by the reviewer."
      />
      <TextArea
        name="reference_links"
        label="References and source links"
        rows={4}
        maxLength={2000}
        defaultValue={d.reference_links}
        hint="One per line, for example the guideline or study behind a claim."
      />
      <TextField
        name="attribution"
        label="How should we credit you?"
        required
        maxLength={200}
        defaultValue={d.attribution}
        hint="For example: Dr Jane Doe, Consultant Breast Surgeon."
      />
      <CheckField name="consent_ownership">
        I made this video or have the right to share it, and I agree it may be shown on this website if approved.
      </CheckField>
      <CheckField name="consent_patient_privacy">
        The video does not show or identify any patient, and I have written permission for anything that could.
      </CheckField>
    </>
  );
}
