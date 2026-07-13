import { useState, useEffect, useCallback } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import ModelSelector, { getModelInfo } from '../components/ModelSelector';
import EcoScoreBadge from '../components/EcoScoreBadge';
import SovereigntyGauge from '../components/SovereigntyGauge';
import { useToast } from '../context/ToastContext';
import {
    Zap, Copy, Check, Loader2, Smartphone, Car, Lightbulb,
    Info, AlertCircle, Sparkles, Leaf, Shield, X,
    ShieldCheck, ShieldAlert, MapPin, Building2, FileKey,
    Droplets, BatteryCharging, Send, ChevronRight
} from 'lucide-react';
import Tooltip from '../components/Tooltip';

const formatSmallNumber = (num, decimals = 4) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    if (Math.abs(num) < 0.001) return num.toExponential(1);
    return num.toFixed(decimals).replace(/\.?0+$/, '') || '0';
};

const formatEquivalence = (num) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (num < 0.001) return '< 0.001';
    if (num < 1) return num.toFixed(3);
    return num.toFixed(2);
};

const MetricCell = ({ icon: Icon, iconColor, value, label, delay = 0 }) => (
    <div
        className="text-center rounded-xl border border-[var(--glass-border)] neon-hover animate-fade-in-up"
        style={{ padding: '0.85rem 0.5rem', background: 'var(--bg-surface)', animationDelay: `${delay}ms` }}
    >
        <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${iconColor}14`, border: `1px solid ${iconColor}20` }}>
            <Icon className="w-4 h-4" style={{ color: iconColor, filter: `drop-shadow(0 0 3px ${iconColor}66)` }} />
        </div>
        <p className="text-base font-bold leading-none mb-1" style={{ color: iconColor, fontFamily: 'var(--font-display)' }}>{value}</p>
        <p className="text-[10px] text-[var(--text-muted)] leading-tight">{label}</p>
    </div>
);

/* ── Loading overlay during generation ── */
const GeneratingOverlay = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl" style={{ background: 'rgba(6,13,9,0.85)', backdropFilter: 'blur(8px)' }}>
        <div className="relative w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--primary)] animate-spin" style={{ filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.5))' }} />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[var(--accent)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s', filter: 'drop-shadow(0 0 6px rgba(0,255,135,0.4))' }} />
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-[var(--primary-light)] animate-spin" style={{ animationDuration: '2s', filter: 'drop-shadow(0 0 4px rgba(125,255,90,0.3))' }} />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[var(--primary)] animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Optimisation en cours</p>
        <p className="text-xs text-[var(--text-muted)]">Analyse et amélioration de votre prompt…</p>
        <div className="w-32 h-1 rounded-full mt-4 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            <div className="h-full rounded-full" style={{ background: 'var(--gradient-primary)', animation: 'progress-fill 8s ease-out forwards', boxShadow: '0 0 6px rgba(57,255,20,0.4)' }} />
        </div>
    </div>
);

const Generator = () => {
    const [inputText, setInputText] = useState('');
    const [targetModel, setTargetModel] = useState(() => localStorage.getItem('preferred_model') || 'mistral_2');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [showReasoning, setShowReasoning] = useState(false);
    const [showEcoInfo, setShowEcoInfo] = useState(false);
    const [showSovInfo, setShowSovInfo] = useState(false);
    const [copied, setCopied] = useState(false);

    const toast = useToast();

    const handleModelChange = (model) => {
        setTargetModel(model);
        localStorage.setItem('preferred_model', model);
    };

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim() || isGenerating) return;
        setError('');
        setIsGenerating(true);
        setResult(null);
        setShowReasoning(false);
        setCopied(false);
        try {
            const data = await promptAPI.generate(inputText, targetModel);
            setResult(data);
            toast.showToast({ title: 'Succès', message: 'Prompt optimisé avec succès !', type: 'success' });
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Veuillez vérifier votre email pour utiliser cette fonctionnalité.');
            } else {
                setError(err.response?.data?.detail || 'Une erreur est survenue lors de la génération.');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [inputText, targetModel, isGenerating, toast]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleGenerate();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleGenerate]);

    const handleCopy = async () => {
        if (result?.optimized_prompt) {
            await navigator.clipboard.writeText(result.optimized_prompt);
            setCopied(true);
            toast.showToast({ title: 'Copié', message: 'Prompt copié dans le presse-papier !', type: 'success', duration: 2000 });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const modelInfo = getModelInfo(targetModel);

    return (
        <Layout>
            <div className="container">
                {/* ── Page Header ── */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="neon-badge mx-auto mb-4">
                        <Sparkles className="w-3 h-3" />
                        Optimisation de prompt
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                        Générateur de Prompts
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed text-sm">
                        Transformez votre intention en prompt optimisé et mesurez votre impact environnemental en temps réel.
                    </p>
                </div>

                {/* ── Main Grid ── */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* ══ LEFT: Input ══ */}
                    <div className="glass-card flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-3">
                            <div className="square-icon bg-[var(--primary)]/10 border border-[var(--primary)]/15">
                                <Zap className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.5))' }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)] text-base">Votre Intention</h2>
                                <p className="text-xs text-[var(--text-muted)]">Décrivez ce que vous voulez accomplir</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ex : Je veux créer une image d'un coucher de soleil sur Mars avec des teintes orangées…"
                                className="input-field resize-none"
                                style={{ minHeight: '160px', lineHeight: 1.6 }}
                                disabled={isGenerating}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] opacity-80 mt-1">
                                <span>{inputText.length} caractères</span>
                                <span className="flex items-center gap-1">
                                    <kbd className="kbd-key">Ctrl</kbd>
                                    <span>+</span>
                                    <kbd className="kbd-key">↵</kbd>
                                    <span className="hidden sm:inline">pour lancer</span>
                                </span>
                            </div>
                        </div>

                        <ModelSelector value={targetModel} onChange={handleModelChange} disabled={isGenerating} />

                        <button
                            onClick={handleGenerate}
                            disabled={!inputText.trim() || isGenerating}
                            className="btn btn-primary w-full group"
                            style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.9375rem' }}
                        >
                            {isGenerating ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /><span>Optimisation…</span></>
                            ) : (
                                <><Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /><span>Optimiser mon prompt</span></>
                            )}
                        </button>

                        {error && (
                            <div className="alert alert-error animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* ══ RIGHT: Output ══ */}
                    <div className="glass-card flex flex-col gap-5 relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {isGenerating && <GeneratingOverlay />}

                        <div className="flex items-center gap-3">
                            <div className="square-icon" style={{ backgroundColor: `${modelInfo.color}18`, border: `1px solid ${modelInfo.color}25` }}>
                                <Sparkles className="w-5 h-5" style={{ color: modelInfo.color, filter: `drop-shadow(0 0 4px ${modelInfo.color}80)` }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)] text-base">Prompt Optimisé</h2>
                                <p className="text-xs text-[var(--text-muted)]">Prêt à copier-coller</p>
                            </div>
                        </div>

                        {result ? (
                            <div className="animate-glow-in flex flex-col gap-5">
                                {/* Output box */}
                                <div
                                    className="relative rounded-xl border-2 transition-all group"
                                    style={{ borderColor: modelInfo.color, background: 'var(--bg-secondary)', boxShadow: `0 0 18px ${modelInfo.color}18` }}
                                >
                                    <pre
                                        className="text-sm text-[var(--text-primary)] font-mono leading-relaxed whitespace-pre-wrap"
                                        style={{ padding: '1rem 3rem 1rem 1rem', wordBreak: 'break-word', overflowWrap: 'break-word', maxHeight: '320px', overflowY: 'auto', margin: 0 }}
                                    >
                                        {result.optimized_prompt}
                                    </pre>

                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-3 right-3 p-2 rounded-lg transition-all hover:scale-110"
                                        style={{ background: copied ? 'rgba(57,255,20,0.15)' : 'var(--bg-surface)', border: copied ? '1px solid rgba(57,255,20,0.3)' : '1px solid var(--glass-border)' }}
                                        title="Copier le prompt"
                                    >
                                        {copied
                                            ? <Check className="w-4 h-4 text-[var(--primary)]" />
                                            : <Copy className="w-4 h-4 text-[var(--text-secondary)]" />}
                                    </button>
                                </div>

                                {/* Reasoning toggle */}
                                {result.ai_reasoning && (
                                    <button onClick={() => setShowReasoning(!showReasoning)} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors self-start group">
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showReasoning ? 'rotate-90' : ''}`} />
                                        <span>Pourquoi ce résultat ?</span>
                                    </button>
                                )}
                                {showReasoning && result.ai_reasoning && (
                                    <div className="alert alert-info animate-fade-in relative">
                                        <button onClick={() => setShowReasoning(false)} className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/5 transition-colors" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs mb-1">Explication de l'IA</p>
                                            <p className="text-xs leading-relaxed opacity-90">{result.ai_reasoning}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Eco + Sovereignty */}
                                <div className="flex flex-col gap-4">
                                    {result.green_data && (
                                        <div className="rounded-xl border border-[var(--glass-border)] animate-fade-in-up" style={{ background: 'var(--bg-secondary)', padding: '1.25rem', animationDelay: '100ms' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Leaf className="w-4 h-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.5))' }} />
                                                    <span className="font-semibold text-sm text-[var(--text-primary)]">Impact Écologique</span>
                                                    <button onClick={() => setShowEcoInfo(!showEcoInfo)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}>
                                                        <Info className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <EcoScoreBadge score={result.green_data.eco_score} size="md" />
                                            </div>
                                            {showEcoInfo && (
                                                <div className="mb-4 p-3.5 rounded-xl border border-[var(--glass-border)] animate-fade-in text-xs text-[var(--text-secondary)] leading-relaxed relative" style={{ background: 'var(--bg-surface)' }}>
                                                    <button onClick={() => setShowEcoInfo(false)} className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/5 transition-colors" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X className="w-3 h-3" /></button>
                                                    <strong className="text-[var(--text-primary)] block mb-1">Pourquoi ce score ?</strong>
                                                    Impact calculé en comparant coût énergétique de l'intention vs prompt optimisé, pondéré par l'efficience du modèle.<br /><br />
                                                    <strong className="text-[var(--text-primary)] block mb-1">Comment l'améliorer ?</strong>
                                                    Modèles légers pour tâches simples, restez concis.
                                                </div>
                                            )}
                                            <div className="grid grid-cols-3 gap-2.5 mb-4">
                                                <MetricCell icon={BatteryCharging} iconColor="var(--primary)" value={result.green_data.tokens_saved || 0} label="tokens économisés" delay={0} />
                                                <MetricCell icon={Leaf} iconColor="var(--eco-b)" value={formatSmallNumber(result.green_data.co2_saved_g)} label="g CO₂ évités" delay={75} />
                                                <MetricCell icon={Droplets} iconColor="#60a5fa" value={formatSmallNumber(result.green_data.water_saved_ml)} label="mL eau épargnés" delay={150} />
                                            </div>
                                            {result.green_data.equivalences && (
                                                <div className="grid grid-cols-3 gap-2.5 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                                                    {[
                                                        { icon: Smartphone, val: formatEquivalence(result.green_data.equivalences.smartphone_charges), label: 'recharges' },
                                                        { icon: Car, val: formatEquivalence(result.green_data.equivalences.km_electric_car), label: 'km en VE' },
                                                        { icon: Lightbulb, val: formatEquivalence(result.green_data.equivalences.hours_led_bulb), label: 'h LED' },
                                                    ].map(({ icon: Icon, val, label }) => (
                                                        <div key={label} className="flex flex-col items-center text-center gap-1">
                                                            <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{val}</span>
                                                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {result.green_data.methodology_source && (
                                                <p className="text-[10px] text-[var(--text-faint)] mt-3 italic">{result.green_data.methodology_source}</p>
                                            )}
                                        </div>
                                    )}

                                    {result.sovereignty_data && (
                                        <div className="rounded-xl border border-[var(--glass-border)] animate-fade-in-up" style={{ background: 'var(--bg-secondary)', padding: '1.25rem', animationDelay: '200ms' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 4px rgba(0,255,135,0.4))' }} />
                                                    <span className="font-semibold text-sm text-[var(--text-primary)]">Souveraineté Numérique</span>
                                                    <button onClick={() => setShowSovInfo(!showSovInfo)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}>
                                                        <Info className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <SovereigntyGauge score={result.sovereignty_data.score} size={60} />
                                            </div>
                                            {showSovInfo && (
                                                <div className="mb-4 p-3.5 rounded-xl border border-[var(--glass-border)] animate-fade-in text-xs text-[var(--text-secondary)] leading-relaxed relative" style={{ background: 'var(--bg-surface)' }}>
                                                    <button onClick={() => setShowSovInfo(false)} className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/5 transition-colors" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X className="w-3 h-3" /></button>
                                                    <strong className="text-[var(--text-primary)] block mb-1">Comment est-ce calculé ?</strong>
                                                    Localisation API (Europe vs US), licence (Libre vs Propriétaire), soumission aux lois extra-territoriales (Cloud Act US).<br /><br />
                                                    <strong className="text-[var(--text-primary)] block mb-1">Bonne pratique :</strong>
                                                    Pour données personnelles (RGPD), choisissez un modèle européen (ex : Mistral).
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2 mb-3">
                                                {[
                                                    { icon: MapPin, key: 'location', label: 'Localisation' },
                                                    { icon: Building2, key: 'company', label: 'Entreprise' },
                                                    { icon: FileKey, key: 'license', label: 'Licence' },
                                                ].map(({ icon: Icon, key, label }) => (
                                                    <div key={key} className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors hover:bg-white/3" style={{ background: 'var(--bg-surface)' }}>
                                                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-muted)]" />
                                                        <div className="flex justify-between flex-1 min-w-0">
                                                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                                                            <span className="text-xs font-medium text-[var(--text-primary)] truncate ml-2">{result.sovereignty_data[key]}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.sovereignty_data.cloud_act_risk ? (
                                                    <Tooltip content="Risque juridique lié à l'accès potentiel des autorités US aux données via le Cloud Act.">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/25">
                                                            <ShieldAlert className="w-3.5 h-3.5 text-[var(--error)]" />
                                                            <span className="text-xs font-medium text-[var(--error)]">Cloud Act</span>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content="Modèle opéré par une entité non-soumise aux lois extra-territoriales US.">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                                            <span className="text-xs font-medium text-[var(--primary)]">Hors Cloud Act</span>
                                                        </div>
                                                    </Tooltip>
                                                )}
                                                {result.sovereignty_data.rgpd_compliant !== undefined && (
                                                    result.sovereignty_data.rgpd_compliant ? (
                                                        <Tooltip content="Le fournisseur garantit la conformité avec le Règlement Général sur la Protection des Données.">
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" /><span className="text-xs font-medium text-[var(--primary)]">RGPD</span>
                                                            </div>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip content="Données potentiellement traitées hors zone UE sans garanties RGPD strictes.">
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/25">
                                                                <ShieldAlert className="w-3.5 h-3.5 text-[var(--warning)]" /><span className="text-xs font-medium text-[var(--warning)]">Non RGPD</span>
                                                            </div>
                                                        </Tooltip>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center flex-1">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
                                    style={{ background: 'var(--gradient-primary-soft)', border: '1px solid var(--glass-border)' }}
                                >
                                    <Sparkles className="w-9 h-9 text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-base font-semibold text-[var(--text-secondary)] mb-2">En attente de votre intention</h3>
                                <p className="text-sm text-[var(--text-muted)] max-w-[240px] leading-relaxed mb-5">
                                    Décrivez votre besoin à gauche et laissez l'IA optimiser votre prompt
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                                    <kbd className="kbd-key">Ctrl</kbd>
                                    <span>+</span>
                                    <kbd className="kbd-key">↵</kbd>
                                    <span>pour lancer rapidement</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Generator;
