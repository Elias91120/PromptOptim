"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EnvelopeSimple, Lock, WarningCircle } from "@phosphor-icons/react";
import { AuthLayout } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(email, password);
    if (result.success) setSuccess(true);
    else setError(result.error || "Inscription échouée");
    setLoading(false);
  };

  return (
    <AuthLayout
      title={<>Rejoignez la révolution<br /><span className="gradient-text">Green IT</span></>}
      subtitle="Créez un compte pour accéder à l'optimiseur de prompts éco-responsable."
    >
      <Card>
        <CardContent className="pt-6">
          {success ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">Vérifiez votre email</h2>
              <p className="text-sm text-[var(--text-secondary)]">Un lien de confirmation a été envoyé à {email}</p>
              <Button onClick={() => router.push("/login")} className="w-full">Aller à la connexion</Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6 font-[family-name:var(--font-display)]">Créer un compte</h2>
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
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <Input id="password" type="password" required minLength={8} className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</Button>
              </form>
              <p className="text-sm text-[var(--text-secondary)] text-center mt-6">
                Déjà inscrit ? <Link href="/login" className="text-[var(--primary)] font-medium">Se connecter</Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
