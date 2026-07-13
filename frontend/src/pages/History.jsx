import { useState, useEffect, useMemo } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';
import { getModelInfo } from '../components/ModelSelector';
import {
    History as HistoryIcon, AlertCircle, Calendar, ChevronDown, ChevronUp,
    Copy, Check, Leaf, Lightbulb, Shield, BatteryCharging, Sparkles,
    Search, X, ArrowLeft, ArrowRight
} from 'lucide-react';

const getEcoColor = (score) => {
    switch (score?.toUpperCase()) {
        case 'A': return 'var(--eco-a)';
        case 'B': return 'var(--eco-b)';
        case 'C': return 'var(--eco-c)';
        case 'D': return 'var(--eco-d)';
        case 'E': return 'var(--eco-e)';
        default: return 'var(--text-muted)';
    }
};

const formatSmallNumber = (num) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    return num.toFixed(4).replace(/\.?0+$/, '') || '0';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const ITEMS_PER_PAGE = 10;

/* ── Individual history item ── */
const HistoryItem = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const modelInfo = getModelInfo(item.target_model);
    const ecoScore = item.green_data?.eco_score;
    const sovereigntyScore = item.sovereignty_data?.score;

    const handleCopy = async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(item.optimized_prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sovColor = sovereigntyScore >= 60 ? 'var(--eco-a)' : sovereigntyScore >= 30 ? 'var(--eco-c)' : 'var(--eco-e)';

    return (
        <div
            className="animate-fade-in-up rounded-2xl border border-[var(--glass-border)] overflow-hidden neon-hover"
            style={{
                background: 'var(--bg-surface)',
                animationDelay: `${index * 40}ms`,
                boxShadow: expanded ? '0 0 0 1px rgba(57,255,20,0.15)' : 'none',
            }}
        >
            {/* Header row */}
            <div
                className="flex items-center gap-4 cursor-pointer select-none group"
                style={{ padding: '1.125rem 1.5rem' }}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: '2rem' }}>
                    {ecoScore && (
                        <div
                            className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center text-[var(--bg-primary)]"
                            style={{ backgroundColor: getEcoColor(ecoScore), boxShadow: `0 0 8px ${getEcoColor(ecoScore)}55`, fontFamily: 'var(--font-display)' }}
                        >
                            {ecoScore}
                        </div>
                    )}
                    {sovereigntyScore !== undefined && (
                        <span className="text-[10px] font-semibold" style={{ color: sovColor }}>{sovereigntyScore}%</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase flex-shrink-0"
                            style={{ backgroundColor: `${modelInfo.color}14`, color: modelInfo.color, border: `1px solid ${modelInfo.color}28` }}
                        >
                            {modelInfo.name}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.created_at)}
                        </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                        {item.original_intent}
                    </p>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all hover:scale-110" title="Copier le prompt optimisé">
                        {copied ? <Check className="w-4 h-4" style={{ color: 'var(--primary)' }} /> : <Copy className="w-4 h-4 text-[var(--text-muted)]" />}
                    </button>
                    <div className={`p-2 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div style={{ borderTop: '1px solid var(--glass-border)', padding: '1.75rem 1.5rem' }}>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="section-label">Prompt optimisé</span>
                            <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:scale-105" style={{ color: 'var(--primary)', background: 'rgba(57,255,20,0.08)' }}>
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-secondary)', borderLeft: `3px solid ${modelInfo.color}` }}>
                            <pre className="text-sm text-[var(--text-primary)] font-mono leading-relaxed" style={{ padding: '1rem 1.25rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '360px', overflowY: 'auto', margin: 0 }}>
                                {item.optimized_prompt}
                            </pre>
                        </div>
                    </div>

                    {(item.green_data || item.sovereignty_data) && (
                        <div className="flex flex-wrap gap-2.5 mb-6">
                            {item.green_data?.tokens_saved !== undefined && (
                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-secondary)' }}>
                                    <BatteryCharging className="w-3 h-3" style={{ color: 'var(--primary)' }} />
                                    <span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">{item.green_data.tokens_saved}</strong> tokens</span>
                                </div>
                            )}
                            {item.green_data?.co2_saved_g !== undefined && (
                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-secondary)' }}>
                                    <Leaf className="w-3 h-3" style={{ color: 'var(--eco-b)' }} />
                                    <span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">{formatSmallNumber(item.green_data.co2_saved_g)}</strong> g CO₂</span>
                                </div>
                            )}
                            {item.sovereignty_data && (
                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-secondary)' }}>
                                    <Shield className="w-3 h-3" style={{ color: sovColor }} />
                                    <span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">{sovereigntyScore}/100</strong> souveraineté</span>
                                </div>
                            )}
                        </div>
                    )}

                    {item.ai_reasoning && (
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(77,201,246,0.06)', border: '1px solid rgba(77,201,246,0.18)' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-3.5 h-3.5" style={{ color: 'var(--info)' }} />
                                <h4 className="text-xs font-semibold" style={{ color: 'var(--info)' }}>Explication de l'IA</h4>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ wordBreak: 'break-word' }}>{item.ai_reasoning}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Page ── */
const History = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await promptAPI.getHistory();
                setHistory(data);
            } catch (err) {
                setError(err.response?.status === 403 ? "Veuillez vérifier votre email pour accéder à l'historique." : "Impossible de charger l'historique.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        if (!searchTerm.trim()) return history;
        const lowSearch = searchTerm.toLowerCase();
        return history.filter(item =>
            item.original_intent?.toLowerCase().includes(lowSearch) ||
            item.optimized_prompt?.toLowerCase().includes(lowSearch) ||
            item.target_model?.toLowerCase().includes(lowSearch)
        );
    }, [history, searchTerm]);

    // Reset page when search changes
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <Layout>
            <div className="container max-w-4xl">
                {/* ── Header ── */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0" style={{ boxShadow: 'var(--neon-glow-md)' }}>
                                <HistoryIcon className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} />
                            </div>
                            <div>
                                <h1 className="page-title">Historique</h1>
                                <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Vos prompts optimisés précédents</p>
                            </div>
                        </div>

                        {history.length > 0 && (
                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--glass-border)] flex-shrink-0">
                                <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.5))' }} />
                                <span className="text-base font-bold text-[var(--text-primary)]">{history.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Rechercher dans votre historique..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field w-full rounded-full"
                            style={{ paddingLeft: '3.25rem', paddingRight: '3rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-surface)] transition-colors"
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Content ── */}
                {isLoading ? (
                    <div className="flex flex-col gap-4 animate-fade-in">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="glass-card" style={{ padding: 0 }}>
                                <div className="flex items-center gap-4" style={{ padding: '0.875rem 1.25rem' }}>
                                    <Skeleton width="2rem" height="2rem" borderRadius="6px" />
                                    <div className="flex-1">
                                        <div className="flex gap-4 mb-2">
                                            <Skeleton width="5rem" height="0.65rem" />
                                            <Skeleton width="8rem" height="0.65rem" />
                                        </div>
                                        <Skeleton width="100%" height="0.875rem" />
                                    </div>
                                    <Skeleton width="1.25rem" height="1.25rem" borderRadius="4px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,23,68,0.1)' }}>
                            <AlertCircle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float" style={{ background: 'var(--gradient-primary-soft)', border: '1px solid var(--glass-border)' }}>
                            <HistoryIcon className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-base font-semibold text-[var(--text-secondary)]">Aucun historique</h3>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">Commencez à générer des prompts pour voir votre historique ici</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-20">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p className="text-[var(--text-secondary)] font-medium">Aucun résultat pour "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="text-[var(--primary)] text-sm mt-2 hover:underline">Réinitialiser la recherche</button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4">
                            {paginatedHistory.map((item, index) => (
                                <HistoryItem key={item.id} item={item} index={index} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8 animate-fade-in">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-ghost p-2 disabled:opacity-30"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                        .map((page, i, arr) => (
                                            <span key={page} className="flex items-center">
                                                {i > 0 && arr[i - 1] !== page - 1 && (
                                                    <span className="px-1 text-[var(--text-muted)]">…</span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                                        page === currentPage
                                                            ? 'text-[var(--bg-primary)] font-bold'
                                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                                                    }`}
                                                    style={page === currentPage ? {
                                                        background: 'var(--gradient-primary)',
                                                        boxShadow: 'var(--neon-glow-sm)',
                                                    } : {}}
                                                >
                                                    {page}
                                                </button>
                                            </span>
                                        ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-ghost p-2 disabled:opacity-30"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default History;
