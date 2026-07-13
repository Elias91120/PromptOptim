import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await forgotPassword(email);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
        }
        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="glass-card text-center" style={{ padding: '2.5rem 2rem' }}>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(57,255,20,0.12), rgba(0,255,135,0.08))',
                                boxShadow: '0 0 32px rgba(57,255,20,0.2), 0 0 64px rgba(57,255,20,0.08)',
                                animation: 'pulse-glow 2s ease-in-out infinite',
                            }}
                        >
                            <Mail className="w-9 h-9" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.6))' }} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Email envoyé !</h2>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                            Si un compte existe avec cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe dans quelques minutes.
                        </p>
                        <Link to="/login" className="btn btn-secondary w-full">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à la connexion</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            badge="Récupération de compte"
            title={<>Mot de passe<br /><span className="gradient-text">oublié ?</span></>}
            description="Pas de panique. Entrez votre email et nous vous enverrons un lien sécurisé pour réinitialiser votre accès."
            subtitle="Mot de passe oublié"
        >
            <p className="text-sm text-[var(--text-secondary)] -mt-5 mb-7">
                Entrez votre email pour recevoir un lien de réinitialisation
            </p>

            <div className="glass-card">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && (
                        <div className="alert alert-error animate-fade-in">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon-left" />
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="input-field has-icon-left" required autoComplete="email" />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Envoi en cours…</span></>) : (<span>Envoyer le lien</span>)}
                    </button>
                </form>

                <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--primary)' }}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à la connexion</span>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
