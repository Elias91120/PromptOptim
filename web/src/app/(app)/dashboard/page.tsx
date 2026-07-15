"use client";

import { useEffect, useMemo, useState } from "react";
import { ChartBar, Leaf, Lightning, WarningCircle } from "@phosphor-icons/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modelsAPI, promptAPI } from "@/lib/api";
import { getFallbackModelColor, resolveModelId } from "@/lib/models";
import type { AIModel, UserStats } from "@/lib/types";

interface ChartSlice {
  name: string;
  value: number;
  color: string;
  modelId: string;
}

function DashboardContent() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([promptAPI.getStats(), modelsAPI.getAll()])
      .then(([s, m]) => {
        setStats(s);
        setModels(m);
      })
      .catch((err) => setError((err as { detail?: string }).detail || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const modelById = useMemo(() => Object.fromEntries(models.map((m) => [m.id, m])), [models]);

  const chartData = useMemo<ChartSlice[]>(() => {
    if (!stats) return [];

    const aggregated = new Map<string, number>();
    for (const [rawId, value] of Object.entries(stats.model_usage)) {
      if (value <= 0) continue;
      const canonical = resolveModelId(rawId);
      aggregated.set(canonical, (aggregated.get(canonical) ?? 0) + value);
    }

    return Array.from(aggregated.entries()).map(([modelId, value], index) => {
      const model = modelById[modelId];
      return {
        modelId,
        name: model?.name ?? modelId,
        value,
        color: model?.color ?? getFallbackModelColor(index),
      };
    });
  }, [stats, modelById]);

  const totalPrompts = stats?.total_prompts ?? 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">Dashboard Green IT</h1>
          <p className="text-[var(--text-secondary)] mt-1">Votre impact écologique cumulé</p>
        </div>

        {error && (
          <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <WarningCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[var(--text-muted)]">Chargement...</p>
        ) : stats ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={ChartBar} label="Prompts" value={stats.total_prompts} color="var(--primary)" />
              <StatCard icon={Lightning} label="Tokens économisés" value={stats.total_tokens_saved} color="var(--accent)" />
              <StatCard icon={Leaf} label="CO₂ économisé" value={`${stats.total_co2_saved} g`} color="var(--eco-a)" />
              <StatCard icon={ChartBar} label="Modèles utilisés" value={chartData.length} color="#ff7e00" />
            </div>

            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par modèle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={4}
                          strokeWidth={0}
                        >
                          {chartData.map((entry) => (
                            <Cell key={entry.modelId} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip total={totalPrompts} />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
                    {chartData.map((item) => {
                      const pct = totalPrompts > 0 ? ((item.value / totalPrompts) * 100).toFixed(0) : "0";
                      return (
                        <div key={item.modelId} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
                          />
                          <span className="text-[var(--text-secondary)]">{item.name}</span>
                          <span className="text-[var(--text-muted)]">
                            {item.value} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function ChartTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = item.value ?? 0;
  const pct = total > 0 ? ((value / total) * 100).toFixed(0) : "0";

  return (
    <div className="glass-card rounded-xl px-3 py-2 text-sm shadow-[var(--neon-glow-sm)]">
      <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
      <p className="text-xs text-[var(--text-secondary)]">
        {value} prompts ({pct}%)
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Leaf; label: string; value: string | number; color: string }) {
  return (
    <Card className="neon-hover">
      <CardContent className="pt-6">
        <Icon className="w-5 h-5 mb-3" style={{ color }} />
        <p className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color }}>{value}</p>
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
