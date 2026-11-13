import { ActionForm, SelectField, TextArea, TextField } from "./forms";
import { saveDirectory } from "@/app/actions/admin";
import { serviceTypes } from "@/lib/options";

export type DirRow = {
  id?: string; name?: string; country?: string; city?: string | null; region?: string | null;
  service_types?: string[]; languages?: string[]; website?: string | null; phone?: string | null;
  address?: string | null; about?: string | null; source_url?: string | null;
  last_verified?: string | null; status?: string;
};

export function DirectoryForm({ locale, row }: { locale: string; row?: DirRow }) {
  const r = row ?? {};
  return (
    <ActionForm action={saveDirectory} locale={locale} submitLabel={r.id ? "Save changes" : "Add entry"}>
      {r.id ? <input type="hidden" name="id" value={r.id} /> : null}
      <TextField name="name" label="Name" required maxLength={160} defaultValue={r.name} />
      <TextField name="country" label="Country" required maxLength={80} defaultValue={r.country} />
      <TextField name="city" label="City" maxLength={80} defaultValue={r.city ?? ""} />
      <TextField name="region" label="Region or province" maxLength={80} defaultValue={r.region ?? ""} />
      <fieldset className="field">
        <legend>Services</legend>
        {serviceTypes.map((t) => (
          <label className="check" key={t}>
            <input type="checkbox" name={`st_${t}`} defaultChecked={r.service_types?.includes(t)} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <TextField name="languages" label="Languages" hint="Separate with commas, for example: english, urdu" maxLength={200} defaultValue={(r.languages ?? []).join(", ")} />
      <TextField name="website" label="Official website" hint="Must start with https://" type="url" maxLength={300} defaultValue={r.website ?? ""} />
      <TextField name="phone" label="Phone" maxLength={60} defaultValue={r.phone ?? ""} />
      <TextField name="address" label="Address" maxLength={300} defaultValue={r.address ?? ""} />
      <TextArea name="about" label="Short description" rows={3} maxLength={600} defaultValue={r.about ?? ""} />
      <TextField name="source_url" label="Source link" hint="The official page where you checked these details. Must start with https://" type="url" maxLength={300} defaultValue={r.source_url ?? ""} />
      <TextField name="last_verified" label="Date you checked it" type="date" defaultValue={r.last_verified ?? ""} />
      <SelectField
        name="status"
        label="Status"
        required
        defaultValue={r.status ?? "unverified"}
        options={[
          { value: "unverified", label: "Not yet verified (shown with that label)" },
          { value: "verified", label: "Verified (needs date and source link)" },
          { value: "suspended", label: "Hidden from the public" },
        ]}
      />
    </ActionForm>
  );
}
