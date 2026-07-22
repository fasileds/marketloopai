import { notFound } from "next/navigation";

import { ProductUpdateForm } from "@/components/admin/product-update-form";
import { createServiceRoleClient } from "@/lib/supabase/server";

import { DeleteUpdateButton } from "./delete-update-button";

export const metadata = { title: "Edit product update" };

async function getUpdate(id: string) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("product_updates").select("*").eq("id", id).maybeSingle();
  return data;
}

async function getSubscriberCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .is("unsubscribed_at", null);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function EditProductUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [update, subscriberCount] = await Promise.all([getUpdate(id), getSubscriberCount()]);

  if (!update) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {update.sent ? "Product update" : "Edit product update"}
        </h1>
        <DeleteUpdateButton id={update.id} />
      </div>
      <div className="mt-6">
        <ProductUpdateForm
          updateId={update.id}
          defaultValues={{
            title: update.title,
            content: update.content,
            template: update.template,
            coverImageUrl: update.cover_image_url ?? "",
          }}
          sent={update.sent}
          sentAt={update.sent_at}
          recipientCount={update.recipient_count}
          subscriberCount={subscriberCount}
        />
      </div>
    </div>
  );
}
