"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PartyPopper } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/editing/editable-text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist";

type SubmitState =
  | { status: "idle" | "submitting" }
  | { status: "success"; referralCode: string };

type WaitlistFormCopy = {
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  websiteLabel: string;
  submitLabel: string;
  disclaimer: string;
  successHeading: string;
  successSubheading: string;
};

const DEFAULT_COPY: WaitlistFormCopy = {
  nameLabel: "Full name",
  emailLabel: "Work email",
  companyLabel: "Company (optional)",
  websiteLabel: "Website (optional)",
  submitLabel: "Join Waitlist",
  disclaimer: "No spam. We'll only email you about your early access.",
  successHeading: "You're on the list",
  successSubheading: "Share your referral code to move up the list:",
};

export function WaitlistForm({
  className,
  copy = DEFAULT_COPY,
}: {
  className?: string;
  copy?: WaitlistFormCopy;
}) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: "", email: "", company: "", website: "" },
  });

  async function onSubmit(values: WaitlistInput) {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        setState({ status: "idle" });
        return;
      }

      setState({ status: "success", referralCode: data.referralCode });
      reset();
    } catch {
      toast.error("Network error. Please check your connection and try again.");
      setState({ status: "idle" });
    }
  }

  if (state.status === "success") {
    return (
      <div
        className={`glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center ${className ?? ""}`}
      >
        <PartyPopper className="size-8 text-primary" aria-hidden />
        <h3 className="text-lg font-semibold">
          <EditableText contentKey="waitlistform.success.heading" value={copy.successHeading} />
        </h3>
        <p className="text-sm text-muted-foreground">
          <EditableText
            contentKey="waitlistform.success.subheading"
            value={copy.successSubheading}
          />
        </p>
        <code className="rounded-lg border border-border bg-secondary px-4 py-2 text-base font-semibold tracking-widest">
          {state.referralCode}
        </code>
      </div>
    );
  }

  const submitting = state.status === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`glass noise-overlay flex flex-col gap-4 rounded-2xl p-6 sm:p-8 ${className ?? ""}`}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wl-name">
            <EditableText contentKey="waitlistform.label.name" value={copy.nameLabel} />
          </Label>
          <Input id="wl-name" placeholder="Ada Lovelace" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wl-email">
            <EditableText contentKey="waitlistform.label.email" value={copy.emailLabel} />
          </Label>
          <Input
            id="wl-email"
            type="email"
            placeholder="you@company.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wl-company">
            <EditableText contentKey="waitlistform.label.company" value={copy.companyLabel} />
          </Label>
          <Input id="wl-company" placeholder="Acme Inc." {...register("company")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wl-website">
            <EditableText contentKey="waitlistform.label.website" value={copy.websiteLabel} />
          </Label>
          <Input
            id="wl-website"
            placeholder="yourbrand.com"
            {...register("website")}
            aria-invalid={!!errors.website}
          />
          {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-2 h-11 text-sm">
        {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        <EditableText contentKey="waitlistform.submit.label" value={copy.submitLabel} />
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        <EditableText contentKey="waitlistform.disclaimer" value={copy.disclaimer} />
      </p>
    </form>
  );
}
