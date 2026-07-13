import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;
const passwordRules = [
    { test: (p) => p.length >= 8,                   label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p),                 label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p),                 label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p),                    label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p), label: 'Un caractère spécial' },
];

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryToken = searchParams.get('token');

    const hashParams = useMemo(() => {
        const hash = window.location.hash.substring(1);
        return new URLSearchParams(hash);
    }, []);

    const accessToken  = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const hasTokens    = Boolean(queryToken || (accessToken && refreshToken));

    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword]       = useState(false);
    const [showConfirm, setShowConfirm]         = useState(false);
    const [isSubmitting, setIsSubmitting]       = useState(false);
    const [error, setError]                     = useState('');
    const [success, setSuccess]                 = useState(false);

    const { resetPassword } = useAuth();
    const isPasswordValid = passwordRegex.test(password);
    const passwordsMatch  = password === confirmPassword && confirmPassword.length > 0;

    useEffect(() => {
        if (!hasTokens) setError('Lien de réinitialisation invalide ou expiré.');
    }, [hasTokens]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) { setError('Le mot de passe ne respecte pas les critères de sécurité.'); return; }
        if (!passwordsMatch)  { setError('Les mots de passe ne correspondent pas.'); return; }
        setIsSubmitting(true);

        let result;
        if (queryToken) {
            result = await resetPassword(null, null, password, queryToken);
        } else {
            result = await resetPassword(accessToken, refreshToken, password);
        }

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.error || 'Lien expiré ou invalide');
        }
        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="glass-card text-center" style={{ padding: '2.5rem 2rem' }}>
                        <CheckCircle className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--success)' }} />
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Mot de passe modifié !</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Redirection vers la connexion…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            badge="Sécurité du compte"
            title={<>Nouveau<br /><span className="gradient-text">mot de passe</span></>}
            description="Choisissez un mot de passe fort pour protéger votre compte."
            subtitle="Nouveau mot de passe"
        >
            <div className="glass-card">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && (
                        <div className="alert alert-error animate-fade-in">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Nouveau mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field has-icon-left has-icon-right" required autoComplete="new-password" disabled={!hasTokens} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="input-label">Confirmer le mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="input-field has-icon-left has-icon-right" required autoComplete="new-password" disabled={!hasTokens} />
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting || !isPasswordValid || !passwordsMatch || !hasTokens} className="btn btn-primary w-full">
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Réinitialisation…</span></>) : (<span>Réinitialiser le mot de passe</span>)}
                    </button>
                </form>
                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium mt-4" style={{ color: 'var(--primary)' }}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à la connexion</span>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
