import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-md animate-fade-in relative z-10">
            {/* 404 Number */}
            <div className="relative mb-8">
                <h1
                    className="text-[8rem] md:text-[10rem] font-black leading-none gradient-text select-none"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.05em' }}
                >
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-[var(--primary)] animate-float opacity-30" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Page introuvable
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xs mx-auto">
                La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour continuer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/generator" className="btn btn-primary px-6 py-3">
                    <Home className="w-4 h-4" />
                    <span>Retour à l'accueil</span>
                </Link>
                <button onClick={() => window.history.back()} className="btn btn-secondary px-6 py-3">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Page précédente</span>
                </button>
            </div>
        </div>
    </div>
);

export default NotFound;
