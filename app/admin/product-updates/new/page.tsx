import { ProductUpdateForm } from "@/components/admin/product-update-form";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = { title: "New product update" };

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

export default async function NewProductUpdatePage() {
  const subscriberCount = await getSubscriberCount();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New product update</h1>
      <div className="mt-6">
        <ProductUpdateForm subscriberCount={subscriberCount} />
      </div>
    </div>
  );
}
