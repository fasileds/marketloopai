import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CONTENT_FIELDS } from "@/lib/content/registry";

export const metadata = { title: "Content" };

export default async function AdminContentPage() {
  const values = await getSiteContent();

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Edit the text shown across the public site. Changes apply as soon as you save — no
        deploy needed. Fields marked JSON must stay valid JSON (arrays of objects).
      </p>

      <div className="mt-8">
        <ContentEditorForm fields={CONTENT_FIELDS} values={values} />
      </div>
    </div>
  );
}
