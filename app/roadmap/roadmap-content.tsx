"use client";

import { ArrowBigUp, CheckCircle2, CircleDashed, Loader } from "lucide-react";
import { useState } from "react";

import { EditableText } from "@/components/editing/editable-text";

type Status = "planned" | "in-progress" | "completed";

type RoadmapItem = {
  id: string;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  status: Status;
};

type StatusLabels = Record<Status, { label: string; key: string }>;

const STATUS_ICONS: Record<Status, typeof CircleDashed> = {
  planned: CircleDashed,
  "in-progress": Loader,
  completed: CheckCircle2,
};

const VOTES_KEY = "marketloopai-roadmap-votes";

function loadJson(key: string): Record<string, number | boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}

export function RoadmapContent({
  items,
  statusLabels,
}: {
  items: RoadmapItem[];
  statusLabels: StatusLabels;
}) {
  const [votes, setVotes] = useState<Record<string, number>>(
    () => loadJson(VOTES_KEY) as Record<string, number>,
  );
  const [voted, setVoted] = useState<Record<string, boolean>>(
    () => loadJson(`${VOTES_KEY}-voted`) as Record<string, boolean>,
  );

  function vote(id: string) {
    if (voted[id]) return;
    const nextVotes = { ...votes, [id]: (votes[id] ?? 0) + 1 };
    const nextVoted = { ...voted, [id]: true };
    setVotes(nextVotes);
    setVoted(nextVoted);
    window.localStorage.setItem(VOTES_KEY, JSON.stringify(nextVotes));
    window.localStorage.setItem(`${VOTES_KEY}-voted`, JSON.stringify(nextVoted));
  }

  const groups: Status[] = ["in-progress", "planned", "completed"];

  return (
    <div className="mx-auto max-w-[100rem] space-y-16">
      {groups.map((status) => {
        const Icon = STATUS_ICONS[status];
        const meta = statusLabels[status];
        const groupItems = items.filter((item) => item.status === status);
        if (groupItems.length === 0) return null;

        return (
          <div key={status}>
            <div className="mb-6 flex items-center gap-2">
              <Icon className="size-4 text-primary" aria-hidden />
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                <EditableText contentKey={meta.key} value={meta.label} />
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupItems.map((item) => (
                <div key={item.id} className="glass flex flex-col justify-between rounded-2xl p-6">
                  <div>
                    <h3 className="text-base font-medium">
                      <EditableText contentKey={item.titleKey} value={item.title} />
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <EditableText multiline contentKey={item.descriptionKey} value={item.description} />
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => vote(item.id)}
                    disabled={voted[item.id]}
                    className={`mt-5 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      voted[item.id]
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ArrowBigUp className="size-3.5" aria-hidden />
                    {votes[item.id] ?? 0} {voted[item.id] ? "voted" : "vote"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
