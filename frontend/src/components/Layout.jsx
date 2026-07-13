import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Leaf, Zap, History, BarChart3, LogOut, Menu, X, User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import OnboardingModal from './OnboardingModal';

const Layout = ({ children }) => {
    const { logout, isAuthenticated, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/generator', label: 'Générateur', icon: Zap },
        { path: '/history', label: 'Historique', icon: History },
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;

    const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Floating Header ── */}
            <header
                className={`fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[94%] md:max-w-5xl z-50 transition-all duration-500 ${scrolled ? 'top-2' : 'top-4'}`}
                style={{
                    background: scrolled ? 'rgba(11, 24, 16, 0.92)' : 'rgba(11, 24, 16, 0.82)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(57, 255, 20, 0.15)',
                    borderRadius: '18px',
                    boxShadow: scrolled
                        ? '0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(57,255,20,0.08) inset, 0 0 24px rgba(57,255,20,0.05)'
                        : '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(57,255,20,0.06) inset',
                }}
            >
                <div className="flex items-center justify-between h-[60px] px-5 md:px-8">
                    {/* Logo */}
                    <Link to="/generator" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg"
                            style={{ boxShadow: 'var(--neon-glow-sm)' }}
                        >
                            <Leaf className="w-5 h-5 text-[var(--bg-primary)]" />
                        </div>
                        <span
                            className="text-base font-bold text-white tracking-wide hidden sm:block"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
                        >
                            PromptOptim
                        </span>
                    </Link>

                    {/* Desktop Nav — centered */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 rounded-xl transition-all text-sm font-medium px-4 py-2 ${
                                            active
                                                ? 'text-[var(--bg-primary)] font-bold'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                                        }`}
                                        style={active ? {
                                            background: 'var(--gradient-primary)',
                                            boxShadow: '0 0 14px rgba(57, 255, 20, 0.45), 0 2px 8px rgba(0,0,0,0.2)',
                                        } : {}}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {isAuthenticated && (
                            <>
                                {/* User avatar */}
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                color: 'var(--bg-primary)',
                                            }}
                                        >
                                            {userInitial}
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] max-w-[120px] truncate">
                                            {user?.email || 'Utilisateur'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[rgba(255,23,68,0.08)] rounded-xl transition-all"
                                        title="Déconnexion"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Mobile toggle */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all rounded-lg hover:bg-[var(--bg-surface)]"
                                >
                                    <div className="relative w-5 h-5">
                                        <Menu className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                                        <X className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
                        isAuthenticated && mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    style={{ borderTop: isAuthenticated && mobileMenuOpen ? '1px solid var(--glass-border)' : 'none' }}
                >
                    <nav className="p-3 flex flex-col gap-1">
                        {/* User info */}
                        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-white/3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--gradient-primary)', color: 'var(--bg-primary)' }}>
                                {userInitial}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.email || 'Utilisateur'}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">Connecté</p>
                            </div>
                        </div>

                        {navItems.map((item, i) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 rounded-xl transition-all animate-fade-in py-3 px-4 ${
                                        active ? 'font-bold' : 'text-[var(--text-secondary)]'
                                    }`}
                                    style={{
                                        animationDelay: `${i * 50}ms`,
                                        ...(active ? {
                                            background: 'var(--gradient-primary)',
                                            color: 'var(--bg-primary)',
                                            boxShadow: 'var(--neon-glow-sm)',
                                        } : {}),
                                    }}
                                >
                                    <item.icon className="w-[18px] h-[18px]" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}

                        <div className="neon-divider my-1" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 rounded-xl w-full text-left transition-all py-3 px-4 animate-fade-in"
                            style={{ color: 'var(--error)', animationDelay: '150ms' }}
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main style={{ paddingTop: '6.5rem', paddingBottom: '5rem', flex: 1 }}>
                {children}
            </main>

            {/* ── Modals ── */}
            {isAuthenticated && <OnboardingModal />}

            {/* ── Footer ── */}
            <footer className="relative" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', padding: '1.5rem 0' }}>
                {/* Gradient top line */}
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(57,255,20,0.5) 50%, transparent 100%)' }} />

                <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        <span className="text-[13px] font-semibold text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-display)' }}>
                            PromptOptim
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">— Green IT & Souveraineté</span>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                        {[
                            { label: 'Mentions Légales', path: '/mentions-legales' },
                            { label: 'Confidentialité', path: '/confidentialite' },
                            { label: 'Contact', path: '/contact' },
                        ].map(({ label, path }) => (
                            <Link
                                key={path}
                                to={path}
                                className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors relative group"
                            >
                                {label}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--primary)] transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
