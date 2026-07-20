import { LegalPageForm } from "@/components/admin/legal-page-form";

export const metadata = { title: "New legal page" };

export default function NewLegalPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New legal page</h1>
      <div className="mt-6">
        <LegalPageForm />
      </div>
    </div>
  );
}
