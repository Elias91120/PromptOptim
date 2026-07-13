import React from 'react';

const Skeleton = ({ width, height, borderRadius = '0.75rem', className = '' }) => {
    return (
        <div 
            className={`animate-pulse ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: borderRadius,
                background: 'linear-gradient(90deg, var(--bg-surface) 25%, rgba(57, 255, 20, 0.05) 50%, var(--bg-surface) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 2s infinite linear',
                border: '1px solid rgba(57, 255, 20, 0.05)'
            }}
        />
    );
};

export default Skeleton;
