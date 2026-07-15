"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <AppShell>
      <Card>
        <CardContent className="pt-6 text-sm text-[var(--text-secondary)] space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">Contact</h1>
          <p>Pour toute question : <a href="mailto:contact@3geeks.fr" className="text-[var(--primary)]">contact@3geeks.fr</a></p>
          <p>Support PromptOptim : test@3geeks.fr (compte démo disponible)</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
