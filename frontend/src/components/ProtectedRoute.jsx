import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px]" />
                
                <div className="glass-card flex flex-col items-center justify-center relative z-10 animate-pulse-glow" style={{ padding: '2.5rem 3rem' }}>
                    <div className="relative flex items-center justify-center mb-5 w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-t-2 border-[var(--primary)] animate-spin" style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))' }}></div>
                        <div className="absolute inset-1.5 rounded-full border-r-2 border-[var(--accent)] animate-spin" style={{ animationDirection: 'reverse', filter: 'drop-shadow(0 0 8px rgba(0, 255, 135, 0.4))', animationDuration: '1.5s' }}></div>
                        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold gradient-text mb-1 tracking-wide">PromptOptim</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest mt-1">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
