"use client";

import { useMemo, useState } from "react";
import { Code, Globe, Image as ImageIcon } from "@phosphor-icons/react";
import type { AIModel, ModelCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryFilters: { id: ModelCategory | "all"; label: string; icon: typeof Globe }[] = [
  { id: "all", label: "Tous", icon: Globe },
  { id: "general", label: "Général", icon: Globe },
  { id: "code", label: "Code", icon: Code },
  { id: "image", label: "Image", icon: ImageIcon },
];

interface ModelPickerProps {
  models: AIModel[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function ModelPicker({ models, value, onChange, disabled }: ModelPickerProps) {
  const [filter, setFilter] = useState<ModelCategory | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? models : models.filter((m) => m.category === filter)),
    [filter, models],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => setFilter(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold min-h-11 transition-all cursor-pointer",
              filter === id
                ? "bg-gradient-primary text-on-primary"
                : "border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]",
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((model) => {
          const selected = model.id === value;
          return (
            <button
              key={model.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(model.id)}
              className={cn(
                "text-left rounded-2xl p-4 border transition-all min-h-[88px] cursor-pointer neon-hover",
                selected
                  ? "border-[var(--primary)] bg-[var(--primary-dim)] shadow-[var(--neon-glow-sm)]"
                  : "border-[var(--glass-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]",
              )}
              style={{ borderColor: selected ? model.color : undefined }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-sm" style={{ color: selected ? model.color : undefined }}>
                    {model.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">{model.provider}</p>
                </div>
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ borderColor: `${model.color}55`, color: model.color }}
                >
                  {model.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{model.description}</p>
              <p className="text-[10px] mt-2 text-[var(--text-muted)]">
                Souveraineté {model.sovereignty.score}% · {model.sovereignty.location}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getModelById(models: AIModel[], id: string) {
  return models.find((m) => m.id === id) ?? models[0];
}
