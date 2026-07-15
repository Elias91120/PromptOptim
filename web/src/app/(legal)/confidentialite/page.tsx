"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfidentialitePage() {
  return (
    <AppShell>
      <Card>
        <CardContent className="pt-6 text-sm text-[var(--text-secondary)] space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">Politique de confidentialité</h1>
          <p>Vos prompts sont stockés de manière sécurisée pour votre historique personnel.</p>
          <p>Les données PII sont anonymisées avant envoi au moteur IA.</p>
          <p>Conformité RGPD : droit d&apos;accès, rectification et suppression via votre compte.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
