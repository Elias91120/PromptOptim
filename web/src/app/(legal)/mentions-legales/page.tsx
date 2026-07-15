"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";

export default function MentionsLegalesPage() {
  return (
    <AppShell>
      <Card>
        <CardContent className="pt-6 text-sm text-[var(--text-secondary)] space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">Mentions légales</h1>
          <p>PromptOptim est édité par 3Geeks.</p>
          <p>Hébergement : infrastructure 3Geeks (Coolify, France/EU).</p>
          <p>Contact : <Link href="/contact" className="text-[var(--primary)]">page contact</Link></p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
