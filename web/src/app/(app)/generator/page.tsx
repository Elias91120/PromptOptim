"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Drop,
  Leaf,
  Lightning,
  Shield,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast, Toaster } from "sonner";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getModelById, ModelPicker } from "@/components/generator/model-picker";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Textarea } from "@/components/ui/input";
import { modelsAPI, promptAPI } from "@/lib/api";
import type { AIModel, PromptResponse } from "@/lib/types";
import { formatSmallNumber, getEcoColor } from "@/lib/utils";

const DEFAULT_MODEL = "claude_sonnet_5";

function GeneratorContent() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [inputText, setInputText] = useState("");
  const [targetModel, setTargetModel] = useState(DEFAULT_MODEL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_model");
    if (saved) setTargetModel(saved);
    modelsAPI.getAll().then(setModels).catch(() => toast.error("Impossible de charger les modèles"));
  }, []);

  const handleModelChange = (id: string) => {
    setTargetModel(id);
    localStorage.setItem("preferred_model", id);
  };

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setError("");
    setResult(null);
    try {
      const data = await promptAPI.generate(inputText.trim(), targetModel);
      setResult(data);
      toast.success("Prompt optimisé avec succès");
    } catch (err) {
      setError((err as { detail?: string }).detail || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, targetModel]);

  const handleCopy = async () => {
    if (!result?.optimized_prompt) return;
    await navigator.clipboard.writeText(result.optimized_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selected = getModelById(models, targetModel);

  return (
    <AppShell>
      <Toaster theme="dark" position="top-right" richColors />
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--primary)] mb-2">Green IT Engine</p>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)]">
            Optimisez vos <span className="gradient-text">prompts</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
            Transformez une intention brute en prompt production-ready, avec impact écologique et score de souveraineté.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning weight="fill" className="w-5 h-5 text-[var(--primary)]" />
                Votre intention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input">Texte brut</Label>
                <Textarea
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ex: Écris un email pour demander une augmentation..."
                  maxLength={4000}
                  disabled={isGenerating}
                  className="mt-2 min-h-[180px]"
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right">{inputText.length}/4000</p>
              </div>

              <div>
                <Label>Modèle cible</Label>
                <div className="mt-3">
                  {models.length > 0 ? (
                    <ModelPicker
                      models={models}
                      value={targetModel}
                      onChange={handleModelChange}
                      disabled={isGenerating}
                    />
                  ) : (
                    <p className="text-sm text-[var(--text-muted)]">Chargement des modèles...</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <WarningCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <Button onClick={handleGenerate} disabled={isGenerating || !inputText.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <Sparkle className="w-4 h-4 animate-pulse" />
                    Optimisation...
                  </>
                ) : (
                  <>
                    <Lightning weight="fill" className="w-4 h-4" />
                    Optimiser le prompt
                  </>
                )}
              </Button>
            </CardContent>

            {isGenerating && (
              <div className="absolute inset-0 rounded-2xl bg-[rgba(6,13,9,0.85)] backdrop-blur-sm flex flex-col items-center justify-center">
                <Sparkle className="w-8 h-8 text-[var(--primary)] animate-pulse mb-3" />
                <p className="text-sm font-semibold">Optimisation en cours</p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Résultat optimisé</CardTitle>
              {result && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copié" : "Copier"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] p-4 text-sm whitespace-pre-wrap leading-relaxed min-h-[180px]">
                    {result.optimized_prompt}
                  </div>

                  {result.ai_reasoning && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowReasoning((v) => !v)}
                        className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
                      >
                        {showReasoning ? "Masquer" : "Voir"} le raisonnement IA
                      </button>
                      {showReasoning && (
                        <p className="mt-2 text-xs text-[var(--text-secondary)] rounded-xl bg-white/5 p-3">
                          {result.ai_reasoning}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {result.green_data && (
                      <>
                        <Metric icon={Leaf} label="Eco score" value={result.green_data.eco_score} color={getEcoColor(result.green_data.eco_score)} />
                        <Metric icon={Drop} label="CO₂ économisé" value={`${formatSmallNumber(result.green_data.co2_saved_g)} g`} color="var(--accent)" />
                        <Metric icon={Lightning} label="Tokens" value={String(result.green_data.tokens_saved)} color="var(--primary)" />
                      </>
                    )}
                    {result.sovereignty_data && (
                      <Metric icon={Shield} label="Souveraineté" value={`${result.sovereignty_data.score}%`} color={result.sovereignty_data.score >= 60 ? "var(--eco-a)" : "var(--eco-e)"} />
                    )}
                  </div>

                  {selected && (
                    <p className="text-xs text-[var(--text-muted)]">
                      Optimisé pour <span style={{ color: selected.color }}>{selected.name}</span> · {selected.provider}
                    </p>
                  )}
                </>
              ) : (
                <div className="min-h-[220px] flex flex-col items-center justify-center text-center text-[var(--text-muted)]">
                  <Sparkle className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">Le prompt optimisé apparaîtra ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value, color }: { icon: typeof Leaf; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-surface)] p-3 text-center">
      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
      <p className="text-sm font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <ProtectedRoute>
      <GeneratorContent />
    </ProtectedRoute>
  );
}
