import { EditableText } from "@/components/editing/editable-text";

import { LogoMark } from "./logo-mark";

export function Logo({ className, name = "MarketLoopAI" }: { className?: string; name?: string }) {
  return (
    <span className={`flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <LogoMark className="h-5 w-auto shrink-0" />
      <EditableText contentKey="brand.name" value={name} />
    </span>
  );
}
