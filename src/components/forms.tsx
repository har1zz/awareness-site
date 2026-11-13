"use client";

import { createContext, useActionState, useContext, useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import type { FormState } from "@/lib/form";

const Ctx = createContext<FormState>({});

/**
 * Accessible form wrapper:
 *  - keeps what the user typed when the server finds a problem
 *  - moves focus to the error summary so screen-reader and keyboard users notice it
 *  - disables the button while sending, and says so
 */
export function ActionForm({
  action,
  locale,
  submitLabel,
  children,
  honeypot = false,
  secondary,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  locale: string;
  submitLabel: string;
  children: ReactNode;
  honeypot?: boolean;
  secondary?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const alertRef = useRef<HTMLDivElement>(null);
  const hasError = Boolean(state.error);
  useEffect(() => {
    if (hasError) alertRef.current?.focus();
  }, [state, hasError]);

  const errorList = Object.entries(state.fieldErrors ?? {});

  return (
    <Ctx.Provider value={state}>
      <form action={formAction}>
        {hasError ? (
          <div className="notice urgent" role="alert" tabIndex={-1} ref={alertRef}>
            <p>
              <strong>{state.error}</strong>
            </p>
            {errorList.length > 0 ? (
              <ul>
                {errorList.map(([field, msg]) => (
                  <li key={field}>
                    {field === "form" ? (
                      msg
                    ) : (
                      <a href={`#f-${field}`}>{msg}</a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <input type="hidden" name="locale" value={locale} />
        {honeypot ? (
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
            <label>
              Leave this empty
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>
        ) : null}
        {children}
        <div className="btn-row">
          <button type="submit" className="btn" disabled={pending} aria-busy={pending}>
            {pending ? "Please wait…" : submitLabel}
          </button>
          {secondary}
        </div>
      </form>
    </Ctx.Provider>
  );
}

type Common = {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
};

function useField(name: string) {
  const s = useContext(Ctx);
  const uid = useId();
  const err = s.fieldErrors?.[name];
  return {
    id: `f-${name}`,
    hintId: `${uid}-h`,
    errId: `${uid}-e`,
    err,
    value: s.values?.[name],
  };
}

export function TextField({
  name,
  label,
  hint,
  required,
  type = "text",
  maxLength,
  minLength,
  autoComplete,
  defaultValue,
  inputMode,
}: Common & {
  type?: "text" | "email" | "password" | "url" | "search" | "date";
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  defaultValue?: string;
  inputMode?: "text" | "email" | "url" | "numeric";
}) {
  const f = useField(name);
  const describedBy = [hint ? f.hintId : "", f.err ? f.errId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={f.id}>
        {label}
        {required ? <span className="req"> (required)</span> : <span className="opt"> (optional)</span>}
      </label>
      {hint ? (
        <p className="hint" id={f.hintId}>
          {hint}
        </p>
      ) : null}
      <input
        id={f.id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={type === "password" ? undefined : (f.value ?? defaultValue ?? "")}
        aria-invalid={f.err ? true : undefined}
        aria-describedby={describedBy}
        key={type === "password" ? undefined : (f.value ?? "init")}
      />
      {f.err ? (
        <p className="field-error" id={f.errId}>
          {f.err}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  rows = 6,
  maxLength,
  minLength,
  defaultValue,
}: Common & { rows?: number; maxLength?: number; minLength?: number; defaultValue?: string }) {
  const f = useField(name);
  const describedBy = [hint ? f.hintId : "", f.err ? f.errId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={f.id}>
        {label}
        {required ? <span className="req"> (required)</span> : <span className="opt"> (optional)</span>}
      </label>
      {hint ? (
        <p className="hint" id={f.hintId}>
          {hint}
        </p>
      ) : null}
      <textarea
        id={f.id}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        defaultValue={f.value ?? defaultValue ?? ""}
        key={f.value ?? "init"}
        aria-invalid={f.err ? true : undefined}
        aria-describedby={describedBy}
      />
      {f.err ? (
        <p className="field-error" id={f.errId}>
          {f.err}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  hint,
  required,
  options,
  defaultValue,
}: Common & { options: { value: string; label: string }[]; defaultValue?: string }) {
  const f = useField(name);
  const describedBy = [hint ? f.hintId : "", f.err ? f.errId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={f.id}>
        {label}
        {required ? <span className="req"> (required)</span> : null}
      </label>
      {hint ? (
        <p className="hint" id={f.hintId}>
          {hint}
        </p>
      ) : null}
      <select
        id={f.id}
        name={name}
        required={required}
        defaultValue={f.value ?? defaultValue ?? ""}
        key={f.value ?? "init"}
        aria-invalid={f.err ? true : undefined}
        aria-describedby={describedBy}
      >
        {required ? (
          <option value="" disabled>
            Choose…
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {f.err ? (
        <p className="field-error" id={f.errId}>
          {f.err}
        </p>
      ) : null}
    </div>
  );
}

/** Never pre-ticked. The user must actively agree. */
export function CheckField({
  name,
  children,
  required = true,
}: {
  name: string;
  children: ReactNode;
  required?: boolean;
}) {
  const f = useField(name);
  return (
    <div className="field">
      <label className="check" htmlFor={f.id}>
        <input
          id={f.id}
          type="checkbox"
          name={name}
          required={required}
          defaultChecked={f.value === "on"}
          key={f.value ?? "init"}
          aria-invalid={f.err ? true : undefined}
          aria-describedby={f.err ? f.errId : undefined}
        />
        <span>{children}</span>
      </label>
      {f.err ? (
        <p className="field-error" id={f.errId}>
          {f.err}
        </p>
      ) : null}
    </div>
  );
}
