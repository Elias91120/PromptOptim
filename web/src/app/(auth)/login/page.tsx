"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { EnvelopeSimple, Lock, WarningCircle } from "@phosphor-icons/react";
import { AuthLayout } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/generator";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.success) router.replace(redirect);
    else setError(result.error || "Email ou mot de passe incorrect");
    setLoading(false);
  };

  return (
    <AuthLayout
      title={<>L&apos;IA au service de<br /><span className="gradient-text">l&apos;écologie numérique</span></>}
      subtitle="Optimisez vos prompts pour réduire votre empreinte carbone tout en gagnant en précision et en souveraineté."
    >
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-1 font-[family-name:var(--font-display)]">Connexion</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Connectez-vous pour optimiser vos prompts</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <WarningCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <Input id="email" type="email" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/forgot-password" className="text-xs text-[var(--primary)]">Mot de passe oublié ?</Link>
              </div>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <Input id="password" type="password" required className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button>
          </form>
          <p className="text-sm text-[var(--text-secondary)] text-center mt-6">
            Pas de compte ? <Link href="/register" className="text-[var(--primary)] font-medium">Créer un compte</Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
