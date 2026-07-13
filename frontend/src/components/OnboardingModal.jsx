import { useState, useEffect, useRef } from 'react';
import { X, Leaf, Shield, Zap, ArrowRight, Sparkles, FastForward } from 'lucide-react';

import { useAuth } from '../context/AuthContext';


const OnboardingModal = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const hasOnboarded = localStorage.getItem(`onboarded_v2_${user.id}`);
            if (!hasOnboarded) {
                if (!timerRef.current) {
                    timerRef.current = setTimeout(() => setIsOpen(true), 800);
                }
                return () => {
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                    }
                };
            }
        } else {
            setIsOpen(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isAuthenticated, user?.id]);


    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsOpen(false);
            if (user?.id) {
                localStorage.setItem(`onboarded_v2_${user.id}`, 'true');
            }
            setIsExiting(false);
        }, 300);
    };


    if (!isOpen) return null;

    const steps = [
        {
            image: '/3.png',
            color: 'var(--accent)',
            title: 'Souveraineté Numérique',
            content: "Vos données sont protégées par des modèles européens, hors du Cloud Act, garantissant une confidentialité absolue.",
        },
        {
            image: '/1.png',
            color: 'var(--eco-a)',
            title: 'IA Éco-Responsable',
            content: "Réduisez l'empreinte carbone de vos requêtes grâce à l'optimisation intelligente des tokens.",
        },
        {
            image: '/2.png',
            color: 'var(--primary)',
            title: 'Efficience Maximale',
            content: "Améliorez la pertinence de vos résultats tout en consommant moins de ressources de calcul.",
        },
        {
            image: '/4.png',
            color: 'var(--success)',
            title: 'Prêts à Optimiser !',
            content: "Commencez dès maintenant à transformer vos intentions en prompts d'exception.",
        }
    ];


    const currentStep = steps[step - 1];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
                onClick={handleClose}
            />

            {/* Modal */}
            <div 
                className={`relative w-full max-w-xl glass-card flex flex-col gap-6 overflow-hidden transition-all duration-300 ${isExiting ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'} animate-glow-in`}
                style={{ padding: '2.5rem' }}
            >
                {/* Skip link */}
                <button 
                    onClick={handleClose}
                    className="absolute top-5 left-8 z-20 text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 group"
                >
                    <FastForward className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    <span>Passer le tutoriel</span>
                </button>

                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>


                {/* Image Section */}
                <div className="relative -mx-[2.5rem] -mt-[2.5rem] mb-2 overflow-hidden aspect-[16/9] bg-black/20">
                    <img 
                        src={currentStep.image} 
                        alt={currentStep.title}
                        loading="eager"
                        className="w-full h-full object-cover transition-all duration-500 ease-out"
                        style={{ filter: isExiting ? 'blur(10px) brightness(0.5)' : 'none' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-90" />

                    
                    {/* Floating color accent */}
                    <div 
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10"
                        style={{ background: `${currentStep.color}30`, color: currentStep.color }}
                    >
                        Étape {step} / {steps.length}
                    </div>
                </div>


                {/* Content */}
                <div className="text-center px-4">
                    <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        {currentStep.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                        {currentStep.content}
                    </p>
                </div>


                {/* Footer / Nav */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--glass-border)]">
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div 
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--glass-border)]'}`}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={() => {
                            if (step < steps.length) setStep(step + 1);
                            else handleClose();
                        }}
                        className="btn btn-primary px-6 py-2.5"
                    >
                        <span>{step === steps.length ? 'Commencer' : 'Continuer'}</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OnboardingModal;
