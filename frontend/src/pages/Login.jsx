import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/generator';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(
                result.emailNotVerified
                    ? 'Veuillez vérifier votre email avant de vous connecter.'
                    : result.error || 'Email ou mot de passe incorrect'
            );
        }
        setIsSubmitting(false);
    };

    return (
        <AuthLayout
            badge="Green IT & Souveraineté"
            title={<>L'IA au service de<br /><span className="gradient-text">l'écologie numérique</span></>}
            description="Optimisez vos prompts pour réduire votre empreinte carbone tout en gagnant en précision et en souveraineté."
            subtitle="Connexion"
        >
            <p className="text-sm text-[var(--text-secondary)] -mt-5 mb-7">
                Connectez-vous pour optimiser vos prompts
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
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                className="input-field has-icon-left"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="input-label">Mot de passe</label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium transition-colors"
                                style={{ color: 'var(--primary)' }}
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-field has-icon-left has-icon-right"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-icon-right"
                                tabIndex={-1}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full"
                        style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem', marginTop: '0.25rem', fontSize: '0.9375rem' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Connexion en cours…</span>
                            </>
                        ) : (
                            <span>Se connecter</span>
                        )}
                    </button>
                </form>

                <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                <p className="text-center text-sm text-[var(--text-secondary)]">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>
                        Créer un compte
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
