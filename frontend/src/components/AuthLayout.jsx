import { Link } from 'react-router-dom';
import { Leaf, Zap, Shield } from 'lucide-react';

const features = [
    {
        icon: Zap,
        label: 'Optimisation IA',
        desc: 'Prompts plus précis, moins de tokens consommés',
    },
    {
        icon: Leaf,
        label: 'Mesure CO₂ en temps réel',
        desc: "Calculez l'empreinte carbone de chaque requête",
    },
    {
        icon: Shield,
        label: 'Souveraineté numérique',
        desc: 'Modèles européens & conformité RGPD garantie',
    },
];

const AuthLayout = ({ badge, title, subtitle, description, children }) => (
    <div className="min-h-screen flex">
        {/* ═══ LEFT — Brand panel (desktop only) ═══ */}
        <div
            className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between overflow-hidden"
            style={{ background: 'var(--bg-secondary)', padding: '3rem 3.5rem 3rem 5rem' }}
        >
            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(57,255,20,0.08) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                }}
            />
            {/* Ambient glow */}
            <div
                className="absolute -top-24 -right-24 pointer-events-none"
                style={{
                    width: '360px',
                    height: '360px',
                    background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)',
                }}
            />
            {/* Right border glow line */}
            <div
                className="absolute top-0 right-0 h-full pointer-events-none"
                style={{
                    width: '1px',
                    background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.25) 40%, rgba(57,255,20,0.25) 60%, transparent)',
                }}
            />

            {/* Top — Logo */}
            <div className="relative z-10">
                <Link to="/login" className="flex items-center gap-3 group">
                    <div
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ boxShadow: 'var(--neon-glow-sm)' }}
                    >
                        <Leaf className="w-5 h-5 text-[var(--bg-primary)]" />
                    </div>
                    <span
                        className="text-base font-bold text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        PromptOptim
                    </span>
                </Link>
            </div>

            {/* Middle — Copy + Features */}
            <div className="relative z-10 flex flex-col gap-10">
                <div>
                    <div className="neon-badge mb-5">{badge}</div>
                    <h2
                        className="text-3xl xl:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {title}
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs text-sm">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {features.map(({ icon: Icon, label, desc }, i) => (
                        <div
                            key={label}
                            className="flex items-start gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: 'rgba(57,255,20,0.1)',
                                    border: '1px solid rgba(57,255,20,0.18)',
                                }}
                            >
                                <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                                    {label}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom — Copyright */}
            <p className="relative z-10 text-xs text-[var(--text-faint)]">
                © 2025 PromptOptim — Green IT
            </p>
        </div>

        {/* ═══ RIGHT — Content panel ═══ */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
            <div className="w-full max-w-md animate-fade-in">
                {/* Mobile-only logo */}
                <div className="text-center mb-8 lg:hidden">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-7 h-7 text-[var(--bg-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">PromptOptim</h1>
                </div>

                {/* Heading */}
                {subtitle && (
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">
                            {subtitle}
                        </h1>
                    </div>
                )}

                {children}

                {/* Footer mobile */}
                <p className="text-center text-xs text-[var(--text-faint)] mt-6 lg:hidden">
                    <span style={{ color: 'var(--primary)' }}>Green IT</span> — Économisez des ressources à chaque prompt
                </p>
            </div>
        </div>
    </div>
);

export default AuthLayout;
