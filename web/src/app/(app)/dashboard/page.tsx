"use client";

import { useEffect, useState } from "react";
import { ChartBar, Leaf, Lightning, WarningCircle } from "@phosphor-icons/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modelsAPI, promptAPI } from "@/lib/api";
import type { AIModel, UserStats } from "@/lib/types";

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

  const modelColorMap = Object.fromEntries(models.map((m) => [m.id, m.color]));
  const chartData = stats
    ? Object.entries(stats.model_usage).map(([id, value]) => ({
        name: models.find((m) => m.id === id)?.name ?? id,
        value,
        color: modelColorMap[id] ?? "#39ff14",
      }))
    : [];

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
              <StatCard icon={ChartBar} label="Modèles utilisés" value={Object.keys(stats.model_usage).length} color="#ff7e00" />
            </div>

            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par modèle</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </AppShell>
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
