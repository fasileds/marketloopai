"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/editing/editable-text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  subjectLabel: string;
  messageLabel: string;
  submitLabel: string;
  successHeading: string;
  successMessage: string;
};

const DEFAULT_COPY: ContactFormCopy = {
  nameLabel: "Full name",
  emailLabel: "Email",
  subjectLabel: "Subject",
  messageLabel: "Message",
  submitLabel: "Send Message",
  successHeading: "Message sent",
  successMessage: "Thanks for reaching out — we'll get back to you soon.",
};

export function ContactForm({ copy = DEFAULT_COPY }: { copy?: ContactFormCopy }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      reset();
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    }
  }

  if (sent) {
    return (
      <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 className="size-8 text-primary" aria-hidden />
        <h3 className="text-lg font-semibold">
          <EditableText contentKey="contactform.success.heading" value={copy.successHeading} />
        </h3>
        <p className="text-sm text-muted-foreground">
          <EditableText
            contentKey="contactform.success.message"
            value={copy.successMessage}
            multiline
          />
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass noise-overlay flex flex-col gap-4 rounded-2xl p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ct-name">
            <EditableText contentKey="contactform.label.name" value={copy.nameLabel} />
          </Label>
          <Input id="ct-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ct-email">
            <EditableText contentKey="contactform.label.email" value={copy.emailLabel} />
          </Label>
          <Input id="ct-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ct-subject">
          <EditableText contentKey="contactform.label.subject" value={copy.subjectLabel} />
        </Label>
        <Input id="ct-subject" {...register("subject")} aria-invalid={!!errors.subject} />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ct-message">
          <EditableText contentKey="contactform.label.message" value={copy.messageLabel} />
        </Label>
        <textarea
          id="ct-message"
          rows={5}
          {...register("message")}
          aria-invalid={!!errors.message}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 h-11 text-sm">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        <EditableText contentKey="contactform.submit.label" value={copy.submitLabel} />
      </Button>
    </form>
  );
}
