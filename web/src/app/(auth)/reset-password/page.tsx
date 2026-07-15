"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "@phosphor-icons/react";
import { AuthLayout } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await resetPassword(token ? { token, new_password: password } : { new_password: password });
    if (result.success) setDone(true);
    else setError(result.error || "Échec de la réinitialisation");
    setLoading(false);
  };

  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe sécurisé.">
      <Card>
        <CardContent className="pt-6">
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">Mot de passe mis à jour.</p>
              <Link href="/login"><Button className="w-full">Se connecter</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div>
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <Input id="password" type="password" required minLength={8} className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Mise à jour..." : "Réinitialiser"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}
