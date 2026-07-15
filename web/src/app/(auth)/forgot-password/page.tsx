"use client";

import Link from "next/link";
import { useState } from "react";
import { EnvelopeSimple, WarningCircle } from "@phosphor-icons/react";
import { AuthLayout } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await forgotPassword(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout title="Réinitialisation" subtitle="Recevez un lien pour réinitialiser votre mot de passe.">
      <Card>
        <CardContent className="pt-6">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">Si un compte existe pour {email}, un email a été envoyé.</p>
              <Link href="/login"><Button variant="outline" className="w-full">Retour connexion</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <Input id="email" type="email" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
