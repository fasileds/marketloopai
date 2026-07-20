"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonial";

export function TestimonialForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { quote: "", authorName: "", authorRole: "", published: true, sortOrder: 0 },
  });

  async function onSubmit(values: TestimonialInput) {
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("Failed to add testimonial.");
      return;
    }

    toast.success("Testimonial added.");
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass flex flex-col gap-4 rounded-2xl p-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="t-quote">Quote</Label>
        <textarea
          id="t-quote"
          rows={3}
          {...register("quote")}
          aria-invalid={!!errors.quote}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-name">Author name</Label>
          <Input id="t-name" {...register("authorName")} aria-invalid={!!errors.authorName} />
          {errors.authorName && (
            <p className="text-xs text-destructive">{errors.authorName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-role">Author role (optional)</Label>
          <Input id="t-role" {...register("authorRole")} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4 accent-primary" {...register("published")} />
        Published
      </label>
      <Button type="submit" size="sm" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Add testimonial
      </Button>
    </form>
  );
}
