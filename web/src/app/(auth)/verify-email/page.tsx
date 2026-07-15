"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Vérification email" subtitle="Votre compte est en attente de validation.">
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">Consultez votre boîte mail et cliquez sur le lien de vérification.</p>
          <Link href="/login"><Button className="w-full">Retour à la connexion</Button></Link>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
