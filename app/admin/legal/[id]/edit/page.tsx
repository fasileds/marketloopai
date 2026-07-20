import { notFound } from "next/navigation";

import { LegalPageForm } from "@/components/admin/legal-page-form";
import { createServiceRoleClient } from "@/lib/supabase/server";

import { DeleteLegalPageButton } from "./delete-legal-page-button";

export const metadata = { title: "Edit legal page" };

async function getPage(id: string) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("legal_pages").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditLegalPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPage(id);

  if (!page) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Edit legal page</h1>
        <DeleteLegalPageButton id={page.id} />
      </div>
      <div className="mt-6">
        <LegalPageForm
          pageId={page.id}
          defaultValues={{
            title: page.title,
            slug: page.slug,
            content: page.content,
            published: page.published,
          }}
        />
      </div>
    </div>
  );
}
