import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;

const passwordRules = [
    { test: (p) => p.length >= 8,                          label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p),                        label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p),                        label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p),                           label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p),        label: 'Un caractère spécial' },
];

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const isPasswordValid = passwordRegex.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) {
            setError('Le mot de passe ne respecte pas les critères de sécurité.');
            return;
        }
        if (!passwordsMatch) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setIsSubmitting(true);
        const result = await register(email, password);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } else {
            setError(result.error || 'Une erreur est survenue');
        }
        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(0,255,135,0.1))',
                                boxShadow: '0 0 32px rgba(57,255,20,0.25), 0 0 64px rgba(57,255,20,0.1)',
                                animation: 'pulse-glow 2s ease-in-out infinite',
                            }}
                        >
                            <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.6))' }} />
                        </div>
                        <h2 className="text-2xl font-bold gradient-text mb-5">Compte créé avec succès !</h2>
                        <div className="rounded-xl border border-[var(--glass-border)] mb-5" style={{ padding: '1.25rem', background: 'rgba(57,255,20,0.03)' }}>
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)' }}>
                                    <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                                </div>
                                <span className="text-sm font-semibold text-[var(--text-primary)]">Vérifiez votre email</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">Un email de vérification a été envoyé à</p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>{email}</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
                            Cliquez sur le lien dans l'email pour activer votre compte.
                        </p>
                        <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: '3px', background: 'var(--bg-surface)' }}>
                            <div className="h-full rounded-full" style={{ background: 'var(--gradient-primary)', animation: 'progress-fill 5s linear forwards', boxShadow: '0 0 8px rgba(57,255,20,0.4)' }} />
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">Redirection vers la connexion…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            badge="Rejoignez la communauté"
            title={<>Un web plus<br /><span className="gradient-text">responsable</span></>}
            description="Chaque compte créé, c'est un utilisateur de plus qui choisit de mesurer et réduire son impact numérique."
            subtitle="Créer un compte"
        >
            <p className="text-sm text-[var(--text-secondary)] -mt-5 mb-7">
                Rejoignez la communauté <span style={{ color: 'var(--primary)' }}>Green IT</span>
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

                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field has-icon-left has-icon-right" required autoComplete="new-password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {password.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1 animate-fade-in">
                                {passwordRules.map((rule, i) => {
                                    const ok = rule.test(password);
                                    return (
                                        <div key={i} className="flex items-center gap-2 text-xs" style={{ color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
                                            {ok ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <div className="w-3 h-3 rounded-full border border-current flex-shrink-0" />}
                                            <span>{rule.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="input-label">Confirmer le mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`input-field has-icon-left has-icon-right ${confirmPassword.length > 0 && !passwordsMatch ? 'border-[var(--error)]' : confirmPassword.length > 0 && passwordsMatch ? 'border-[var(--success)]' : ''}`}
                                style={confirmPassword.length > 0 && passwordsMatch ? { boxShadow: '0 0 8px rgba(57,255,20,0.2)' } : {}}
                                required
                                autoComplete="new-password"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && <p className="error-text">Les mots de passe ne correspondent pas</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting || !isPasswordValid || !passwordsMatch} className="btn btn-primary w-full" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Création du compte…</span></>) : (<span>Créer mon compte</span>)}
                    </button>
                </form>

                <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                <p className="text-center text-sm text-[var(--text-secondary)]">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>Se connecter</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
