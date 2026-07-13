import { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div 
                    className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-lg shadow-xl whitespace-normal min-w-[120px] max-w-[200px] animate-fade-in ${positionClasses[position]}`}
                    style={{ backdropFilter: 'blur(8px)' }}
                >
                    {content}
                    {/* Arrow */}
                    <div 
                        className={`absolute w-2 h-2 rotate-45 border border-[var(--glass-border)] bg-[var(--bg-surface)] ${
                            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0' :
                            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0' :
                            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-0 border-b-0' :
                            'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-0 border-t-0'
                        }`}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
