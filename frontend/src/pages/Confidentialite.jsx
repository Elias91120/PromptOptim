import Layout from '../components/Layout';
import { ShieldCheck } from 'lucide-react';

const Confidentialite = () => (
    <Layout>
        <div className="container max-w-3xl" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neon-glow-md)' }}>
                    <ShieldCheck style={{ width: '1.5rem', height: '1.5rem', color: 'var(--bg-primary)' }} />
                </div>
                <h1 className="page-title">Politique de Confidentialité</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>

                <p>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, nous vous informons de la manière dont vos données personnelles sont collectées et traitées.</p>

                <Section title="1. Responsable du traitement">
                    <p>Le responsable du traitement des données est l'éditeur du site PromptOptim (voir Mentions Légales).</p>
                </Section>

                <Section title="2. Données collectées">
                    <p>Nous collectons les données suivantes :</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Données de compte :</strong> adresse email, mot de passe (hashé, jamais stocké en clair)</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Données d'utilisation :</strong> prompts soumis, prompts optimisés, modèle IA choisi, scores écologiques et de souveraineté</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Données techniques :</strong> logs de connexion, adresse IP (pour la sécurité uniquement)</li>
                    </ul>
                </Section>

                <Section title="3. Finalités du traitement">
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                        <li>Fournir le service d'optimisation de prompts</li>
                        <li>Gérer votre compte utilisateur et l'authentification</li>
                        <li>Afficher votre historique et vos statistiques d'impact environnemental</li>
                        <li>Améliorer le service (analyse agrégée et anonymisée)</li>
                    </ul>
                </Section>

                <Section title="4. Base légale">
                    <p>Le traitement de vos données repose sur :</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li><strong style={{ color: 'var(--text-primary)' }}>L'exécution du contrat :</strong> vos données sont nécessaires pour fournir le service</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Le consentement :</strong> vous acceptez cette politique lors de la création de votre compte</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>L'intérêt légitime :</strong> sécurisation du service et prévention des abus</li>
                    </ul>
                </Section>

                <Section title="5. Durée de conservation">
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                        <li>Données de compte : conservées tant que le compte est actif, puis supprimées sous 30 jours après demande de suppression</li>
                        <li>Historique des prompts : conservé tant que le compte est actif</li>
                        <li>Logs techniques : 12 mois maximum</li>
                    </ul>
                </Section>

                <Section title="6. Partage des données">
                    <p>Vos données personnelles ne sont <strong style={{ color: 'var(--text-primary)' }}>jamais vendues</strong> à des tiers. Elles peuvent être transmises aux sous-traitants techniques suivants, uniquement pour le fonctionnement du service :</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li>Hébergeurs : Vercel (frontend), Render (backend), Supabase (base de données — UE)</li>
                        <li>Fournisseurs d'API IA (Mistral AI, Anthropic, OpenAI) — seul le contenu du prompt est transmis, jamais vos données personnelles</li>
                    </ul>
                </Section>

                <Section title="7. Transferts hors UE">
                    <p>La base de données (Supabase) est hébergée en UE. Certains sous-traitants techniques (Vercel, Render, Anthropic, OpenAI) peuvent être situés aux États-Unis. Ces transferts sont encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne. Nous vous encourageons à choisir des modèles européens (Mistral) pour les données sensibles — c'est l'un des engagements fondamentaux de PromptOptim.</p>
                </Section>

                <Section title="8. Vos droits (RGPD)">
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit de rectification :</strong> corriger des données inexactes</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                        <li><strong style={{ color: 'var(--text-primary)' }}>Droit à la limitation :</strong> restreindre le traitement dans certains cas</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>Pour exercer ces droits, contactez-nous à : <strong style={{ color: 'var(--primary)' }}>e.elloumi15@gmail.com</strong></p>
                </Section>

                <Section title="9. Cookies">
                    <p>PromptOptim utilise uniquement des cookies strictement nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking n'est utilisé. Conformément à la directive ePrivacy, ces cookies fonctionnels sont exemptés de consentement.</p>
                </Section>

                <Section title="10. Réclamation">
                    <p>Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la <strong style={{ color: 'var(--text-primary)' }}>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — <span style={{ color: 'var(--primary)' }}>www.cnil.fr</span></p>
                </Section>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>Dernière mise à jour : Mars 2026</p>
            </div>
        </div>
    </Layout>
);

const Section = ({ title, children }) => (
    <div>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>{title}</h2>
        {children}
    </div>
);

export default Confidentialite;
