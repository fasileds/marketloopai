"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const emailSchema = z.object({ email: z.string().trim().email("Enter a valid email address") });
type EmailInput = z.infer<typeof emailSchema>;

export function LoginForm() {
  const [sent, setSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailInput>({ resolver: zodResolver(emailSchema) });

  async function withGoogle() {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) toast.error(error.message);
    } catch {
      toast.error("Sign-in isn't configured yet. Please try again later.");
    }
    setGoogleLoading(false);
  }

  async function onSubmit({ email }: EmailInput) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
    } catch {
      toast.error("Sign-in isn't configured yet. Please try again later.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <Mail className="size-8 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We sent you a magic link. Click it to sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <div className="glass noise-overlay flex flex-col gap-5 rounded-2xl p-6 sm:p-8">
      <Button
        variant="outline"
        size="lg"
        className="h-11 text-sm"
        disabled={googleLoading}
        onClick={withGoogle}
      >
        {googleLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 text-sm">
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Send magic link
        </Button>
      </form>
    </div>
  );
}
