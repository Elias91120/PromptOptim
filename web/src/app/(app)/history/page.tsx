"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { modelsAPI, promptAPI } from "@/lib/api";
import type { AIModel, PromptHistoryItem } from "@/lib/types";
import { getEcoColor } from "@/lib/utils";

function HistoryContent() {
  const [items, setItems] = useState<PromptHistoryItem[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([promptAPI.getHistory(), modelsAPI.getAll()])
      .then(([history, modelList]) => {
        setItems(history);
        setModels(modelList);
      })
      .catch((err) => setError((err as { detail?: string }).detail || "Erreur"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.original_intent.toLowerCase().includes(q) ||
        i.optimized_prompt.toLowerCase().includes(q),
    );
  }, [items, search]);

  const getModelName = (id: string) => models.find((m) => m.id === id)?.name ?? id;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">Historique</h1>
          <p className="text-[var(--text-secondary)] mt-1">{items.length} prompts optimisés</p>
        </div>

        <div className="relative max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <Input className="pl-10" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-[var(--text-muted)]">Chargement...</p>}

        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryRow key={item.id} item={item} modelName={getModelName(item.target_model)} />
          ))}
          {!loading && filtered.length === 0 && (
            <Card><CardContent className="py-10 text-center text-[var(--text-muted)]">Aucun historique</CardContent></Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function HistoryRow({ item, modelName }: { item: PromptHistoryItem; modelName: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const eco = item.green_data?.eco_score;

  const copy = async () => {
    await navigator.clipboard.writeText(item.optimized_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="neon-hover overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left p-5 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.original_intent}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {new Date(item.created_at).toLocaleString("fr-FR")} · {modelName}
            </p>
          </div>
          {eco && (
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[var(--bg-primary)] shrink-0"
              style={{ backgroundColor: getEcoColor(eco) }}
            >
              {eco}
            </span>
          )}
        </div>
      </button>
      {open && (
        <CardContent className="border-t border-[var(--glass-border)] pt-4 space-y-3">
          <p className="text-sm whitespace-pre-wrap text-[var(--text-secondary)]">{item.optimized_prompt}</p>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié" : "Copier"}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
