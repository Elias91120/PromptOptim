import { useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Send, User, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pour un PFE : mailto fallback, pas de backend dédié
        const subject = encodeURIComponent(`[PromptOptim] Message de ${form.name}`);
        const body = encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
        window.location.href = `mailto:e.elloumi15@gmail.com?subject=${subject}&body=${body}`;
        setSent(true);
    };

    return (
        <Layout>
            <div className="container max-w-2xl" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neon-glow-md)' }}>
                        <Mail style={{ width: '1.5rem', height: '1.5rem', color: 'var(--bg-primary)' }} />
                    </div>
                    <div>
                        <h1 className="page-title">Contact</h1>
                        <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Une question, un signalement ou une demande RGPD ?</p>
                    </div>
                </div>

                {sent ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <CheckCircle style={{ width: '3rem', height: '3rem', color: 'var(--primary)', margin: '0 auto 1rem', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.5))' }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Message prêt à envoyer</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Votre client email s'est ouvert avec le message pré-rempli. Envoyez-le pour nous contacter.</p>
                        <button onClick={() => setSent(false)} className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.625rem 2rem' }}>Nouveau message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                <User style={{ width: '0.875rem', height: '0.875rem' }} /> Nom
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Votre nom"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                <Mail style={{ width: '0.875rem', height: '0.875rem' }} /> Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="votre@email.com"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                <MessageSquare style={{ width: '0.875rem', height: '0.875rem' }} /> Message
                            </label>
                            <textarea
                                name="message"
                                required
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Décrivez votre demande (question, exercice de droits RGPD, signalement...)"
                                className="input-field resize-none"
                                style={{ minHeight: '140px', lineHeight: 1.6 }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full" style={{ padding: '0.75rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                            <Send style={{ width: '1rem', height: '1rem' }} />
                            <span>Envoyer le message</span>
                        </button>

                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                            Vous pouvez également nous écrire directement à <strong style={{ color: 'var(--primary)' }}>e.elloumi15@gmail.com</strong><br />
                            Pour toute demande relative à vos données personnelles (accès, rectification, suppression), précisez "Demande RGPD" dans l'objet.
                        </p>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default Contact;
