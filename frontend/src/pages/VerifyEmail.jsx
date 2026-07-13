import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState(token ? 'loading' : 'missing');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                const response = await fetch(`/auth/verify-email?token=${encodeURIComponent(token)}`);
                if (response.ok) {
                    setStatus('success');
                } else {
                    const data = await response.json().catch(() => ({}));
                    setError(data.detail || 'Lien de vérification invalide ou expiré.');
                    setStatus('error');
                }
            } catch {
                setError('Impossible de contacter le serveur.');
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    if (status === 'loading') {
        return (
            <AuthLayout badge="Vérification" title="Vérification en cours…" description="">
                <div className="glass-card text-center" style={{ padding: '2rem' }}>
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-[var(--primary)]" />
                </div>
            </AuthLayout>
        );
    }

    if (status === 'missing' || status === 'error') {
        return (
            <AuthLayout badge="Vérification" title="Échec de la vérification" description="">
                <div className="glass-card text-center" style={{ padding: '2rem' }}>
                    <AlertCircle className="w-10 h-10 mx-auto mb-4 text-[var(--error)]" />
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        {error || 'Lien de vérification manquant ou invalide.'}
                    </p>
                    <Link to="/login" className="btn btn-primary w-full">Retour à la connexion</Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            badge="Vérification de compte"
            title={<>Votre accès est<br /><span className="gradient-text">confirmé !</span></>}
            description="Votre email a été vérifié. Vous faites maintenant partie de l'IA souveraine et durable."
        >
            <div className="glass-card text-center" style={{ padding: '2rem 1.75rem' }}>
                <div className="relative flex items-center justify-center mx-auto mb-6" style={{ width: '6rem', height: '6rem' }}>
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }} />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.18), rgba(0,255,135,0.12))', boxShadow: '0 0 24px rgba(57,255,20,0.3)' }}>
                        <CheckCircle className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Email vérifié !</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                    Votre adresse email a été confirmée avec succès.
                </p>
                <div className="rounded-xl mb-6 text-left" style={{ padding: '1rem 1.25rem', background: 'rgba(57,255,20,0.04)', border: '1px solid rgba(57,255,20,0.14)' }}>
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[var(--primary)]" />
                        <p className="text-xs text-[var(--text-secondary)]">Compte activé — prêt à optimiser vos prompts.</p>
                    </div>
                </div>
                <Link to="/login" className="btn btn-primary w-full">
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;
