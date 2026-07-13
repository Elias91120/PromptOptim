const SovereigntyGauge = ({ score = 0, size = 120 }) => {
    const isCompact = size <= 72;
    const radius = (size - (isCompact ? 12 : 20)) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;
    const strokeWidth = isCompact ? 6 : 10;

    const getColor = (s) => {
        if (s >= 80) return 'var(--eco-a)';
        if (s >= 60) return 'var(--eco-b)';
        if (s >= 40) return 'var(--eco-c)';
        if (s >= 20) return 'var(--eco-d)';
        return 'var(--eco-e)';
    };

    const getGlowColor = (s) => {
        if (s >= 80) return 'rgba(57, 255, 20, 0.5)';
        if (s >= 60) return 'rgba(160, 255, 0, 0.4)';
        if (s >= 40) return 'rgba(255, 221, 0, 0.4)';
        if (s >= 20) return 'rgba(255, 126, 0, 0.4)';
        return 'rgba(255, 23, 68, 0.4)';
    };

    const getLabel = (s) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Bon';
        if (s >= 40) return 'Moyen';
        if (s >= 20) return 'Faible';
        return 'Critique';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Glow filter */}
                    <defs>
                        <filter id={`neon-glow-${score}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--bg-surface)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle with neon glow */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-700 ease-out"
                        filter={`url(#neon-glow-${score})`}
                        style={{ filter: `drop-shadow(0 0 6px ${getGlowColor(score)})` }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className={`${isCompact ? 'text-base' : 'text-2xl'} font-bold`}
                        style={{ color: getColor(score), textShadow: `0 0 10px ${getGlowColor(score)}` }}
                    >
                        {score}
                    </span>
                    {!isCompact && (
                        <span className="text-xs text-[var(--text-secondary)]">/100</span>
                    )}
                </div>
            </div>
            {!isCompact && (
                <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Souveraineté</p>
                    <p className="text-xs text-[var(--text-secondary)]">{getLabel(score)}</p>
                </div>
            )}
        </div>
    );
};

export default SovereigntyGauge;
