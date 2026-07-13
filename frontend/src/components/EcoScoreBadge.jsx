const EcoScoreBadge = ({ score, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-base',
        md: 'w-10 h-10 text-xl',
        lg: 'w-14 h-14 text-2xl',
    };

    const getScoreColor = (s) => {
        switch (s?.toUpperCase()) {
            case 'A': return 'bg-[var(--eco-a)]';
            case 'B': return 'bg-[var(--eco-b)]';
            case 'C': return 'bg-[var(--eco-c)]';
            case 'D': return 'bg-[var(--eco-d)]';
            case 'E': return 'bg-[var(--eco-e)]';
            default: return 'bg-[var(--text-muted)]';
        }
    };

    const getScoreGlow = (s) => {
        switch (s?.toUpperCase()) {
            case 'A': return '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.25)';
            case 'B': return '0 0 10px rgba(160, 255, 0, 0.4), 0 0 20px rgba(160, 255, 0, 0.2)';
            case 'C': return '0 0 10px rgba(255, 221, 0, 0.4), 0 0 20px rgba(255, 221, 0, 0.2)';
            case 'D': return '0 0 10px rgba(255, 126, 0, 0.4), 0 0 20px rgba(255, 126, 0, 0.2)';
            case 'E': return '0 0 10px rgba(255, 23, 68, 0.4), 0 0 20px rgba(255, 23, 68, 0.2)';
            default: return 'none';
        }
    };

    const getScoreLabel = (s) => {
        switch (s?.toUpperCase()) {
            case 'A': return 'Excellent';
            case 'B': return 'Très Bien';
            case 'C': return 'Bien';
            case 'D': return 'Moyen';
            case 'E': return 'À améliorer';
            default: return 'Non disponible';
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${sizeClasses[size]} ${getScoreColor(score)} rounded-xl flex items-center justify-center font-bold text-[var(--bg-primary)]`}
                style={{ boxShadow: getScoreGlow(score) }}
                title={`Eco-Score: ${score}`}
            >
                {score || '?'}
            </div>
            <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Eco-Score</p>
                <p className="text-xs text-[var(--text-secondary)]">{getScoreLabel(score)}</p>
            </div>
        </div>
    );
};

export default EcoScoreBadge;
