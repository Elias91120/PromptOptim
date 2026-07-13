import { useState, useEffect, useRef } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';
import {
    BarChart3, AlertCircle, Zap, Leaf, TrendingUp, PieChart,
    Smartphone, Car, Lightbulb, Globe, Droplets, Activity
} from 'lucide-react';
import {
    PieChart as RechartsPie, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const formatValue = (num, decimals = 4) => {
    if (num === null || num === undefined) return '0';
    if (num === 0) return '0';
    if (Math.abs(num) >= 1) return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    return num.toFixed(decimals).replace(/\.?0+$/, '') || '0';
};

/* ── Animated Counter ── */
const AnimatedNumber = ({ value, duration = 1200 }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const numVal = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
        if (isNaN(numVal) || numVal === 0) { setDisplay(value); return; }

        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numVal);
            setDisplay(current.toLocaleString('fr-FR'));
            if (progress < 1) ref.current = requestAnimationFrame(animate);
        };
        ref.current = requestAnimationFrame(animate);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [value, duration]);

    return <>{display}</>;
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, unit, color, subtitle, delay = 0 }) => (
    <div
        className="glass-card neon-hover flex flex-col gap-3 animate-fade-in-up"
        style={{ padding: '1.25rem', animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between">
            <div className="square-icon" style={{ backgroundColor: `${color}14`, border: `1px solid ${color}22`, width: '2.25rem', height: '2.25rem' }}>
                <Icon className="w-4 h-4" style={{ color, filter: `drop-shadow(0 0 5px ${color}70)` }} />
            </div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color, fontFamily: 'var(--font-display)', textShadow: `0 0 12px ${color}35`, lineHeight: 1 }}>
                    {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                </span>
                {unit && <span className="text-xs text-[var(--text-muted)] font-medium">{unit}</span>}
            </div>
            {subtitle && <p className="text-[10px] text-[var(--text-muted)] mt-1 opacity-80">{subtitle}</p>}
        </div>
        <div className="w-full rounded-full opacity-40" style={{ height: '1.5px', background: `linear-gradient(90deg, ${color}80, transparent)` }} />
    </div>
);

const MODEL_COLORS = {
    mistral_2: '#ff7e00',
    gpt_5: '#74aa9c',
    claude_opus: '#cc785c',
    gemini_3_pro: '#4285f4',
    midjourney_v6: '#9c5cd4',
};

const MODEL_NAMES = {
    mistral_2: 'Mistral',
    gpt_5: 'GPT-5',
    claude_opus: 'Claude',
    gemini_3_pro: 'Gemini',
    midjourney_v6: 'Midjourney',
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await promptAPI.getStats();
                setStats(data);
            } catch (err) {
                setError(
                    err.response?.status === 403
                        ? 'Veuillez vérifier votre email pour accéder aux statistiques.'
                        : 'Impossible de charger les statistiques.'
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const prepareModelUsageData = () => {
        if (!stats?.model_usage) return [];
        return Object.entries(stats.model_usage)
            .filter(([, count]) => count > 0)
            .map(([model, count]) => ({
                name: MODEL_NAMES[model] || model,
                value: count,
                color: MODEL_COLORS[model] || '#666',
            }));
    };

    const modelUsageData = prepareModelUsageData();
    const totalPrompts = stats?.total_prompts || 0;
    const co2 = stats?.total_co2_saved || 0;

    const equivalences = {
        smartphone: co2 > 0 ? (co2 / 8.3 * 1000) : 0,
        car: co2 > 0 ? (co2 / 0.05) : 0,
        led: co2 > 0 ? (co2 / 0.005) : 0,
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            const pct = totalPrompts > 0 ? ((payload[0].value / totalPrompts) * 100).toFixed(0) : 0;
            return (
                <div className="glass-card" style={{ padding: '0.5rem 0.875rem', boxShadow: 'var(--neon-glow-sm)' }}>
                    <p className="text-[var(--text-primary)] font-medium text-sm">{payload[0].name}</p>
                    <p className="text-[var(--text-secondary)] text-xs">{payload[0].value} prompts ({pct}%)</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Layout>
            <div className="container">
                {/* ── Page Header ── */}
                <div className="flex items-center gap-4 mb-10 animate-fade-in">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0" style={{ boxShadow: 'var(--neon-glow-md)' }}>
                        <BarChart3 className="w-6 h-6 text-[var(--bg-primary)]" />
                    </div>
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle" style={{ marginTop: '0.2rem' }}>Vue d'ensemble de votre impact environnemental</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-8 animate-fade-in">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <Skeleton width="2rem" height="2rem" borderRadius="8px" />
                                        <Skeleton width="4rem" height="0.75rem" />
                                    </div>
                                    <Skeleton width="5rem" height="1.75rem" className="mb-1" />
                                    <Skeleton width="6rem" height="0.65rem" />
                                    <Skeleton width="100%" height="1.5px" borderRadius="1px" className="mt-3" />
                                </div>
                            ))}
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                                    <Skeleton width="10rem" height="1rem" className="mb-6" />
                                    <Skeleton width="100%" height="12rem" borderRadius="12px" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,23,68,0.1)' }}>
                            <AlertCircle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* ── Stat Cards ── */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard icon={Zap} label="Prompts générés" value={totalPrompts} color="var(--primary)" delay={0} />
                            <StatCard icon={TrendingUp} label="Tokens économisés" value={stats?.total_tokens_saved || 0} color="var(--accent)" delay={75} />
                            <StatCard icon={Leaf} label="CO₂ économisé" value={formatValue(co2)} unit="g" color="var(--eco-a)" subtitle={co2 > 0 ? `≈ ${(co2 / 1000).toFixed(6)} kg` : null} delay={150} />
                            <StatCard icon={Droplets} label="Eau économisée" value={formatValue(stats?.total_water_saved || 0)} unit="mL" color="#60a5fa" delay={225} />
                        </div>

                        {/* ── Charts Row ── */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <div className="glass-card neon-hover animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: '100ms' }}>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <PieChart className="w-4 h-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)] text-xs uppercase tracking-wider">Répartition par modèle</h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div>
                                        <div className="h-52">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RechartsPie>
                                                    <Pie data={modelUsageData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                                        {modelUsageData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                </RechartsPie>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3">
                                            {modelUsageData.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
                                                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                                                    <span className="text-[var(--text-muted)]">({totalPrompts > 0 ? ((item.value / totalPrompts) * 100).toFixed(0) : 0}%)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-52 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
                                        <PieChart className="w-10 h-10 opacity-15" />
                                        <p className="text-sm">Aucune donnée disponible</p>
                                        <p className="text-xs">Générez votre premier prompt !</p>
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart */}
                            <div className="glass-card neon-hover animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: '200ms' }}>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <BarChart3 className="w-4 h-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)] text-xs uppercase tracking-wider">Utilisation par modèle</h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div className="h-52">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={modelUsageData} layout="vertical" margin={{ left: 8, right: 8 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,255,20,0.08)" horizontal={false} />
                                                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                                                <YAxis dataKey="name" type="category" width={72} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                                                    {modelUsageData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-52 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
                                        <BarChart3 className="w-10 h-10 opacity-15" />
                                        <p className="text-sm">Aucune donnée disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Environmental Impact ── */}
                        <div className="glass-card animate-fade-in-up" style={{ padding: '1.75rem', animationDelay: '300ms' }}>
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.18)' }}>
                                    <Globe className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 6px rgba(57,255,20,0.5))' }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Impact Environnemental</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Équivalences de vos économies</p>
                                </div>
                            </div>

                            {totalPrompts > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    {[
                                        { icon: Smartphone, color: 'var(--primary)', glow: 'rgba(57,255,20,0.4)', value: formatValue(equivalences.smartphone, 2), label: 'recharges smartphone' },
                                        { icon: Car, color: 'var(--accent)', glow: 'rgba(0,255,135,0.4)', value: formatValue(equivalences.car, 2), label: 'mètres en voiture électrique' },
                                        { icon: Lightbulb, color: '#ffdd00', glow: 'rgba(255,221,0,0.4)', value: formatValue(equivalences.led, 2), label: "heures d'éclairage LED" },
                                    ].map(({ icon: Icon, color, glow, value, label }, i) => (
                                        <div key={label} className="rounded-2xl border border-[var(--glass-border)] text-center neon-hover animate-fade-in-up" style={{ background: 'var(--bg-secondary)', padding: '1.75rem 1.25rem', animationDelay: `${350 + i * 75}ms` }}>
                                            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                                                <Icon className="w-6 h-6" style={{ color, filter: `drop-shadow(0 0 6px ${glow})` }} />
                                            </div>
                                            <p className="text-2xl font-bold mb-2" style={{ color, textShadow: `0 0 10px ${glow}`, fontFamily: 'var(--font-display)' }}>{value}</p>
                                            <p className="text-sm text-[var(--text-muted)]">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-15 text-[var(--text-muted)]" />
                                    <p className="text-sm text-[var(--text-muted)] mb-1">Vos équivalences environnementales apparaîtront ici</p>
                                    <p className="text-xs text-[var(--text-faint)]">Chaque prompt optimisé contribue à réduire votre empreinte carbone</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
