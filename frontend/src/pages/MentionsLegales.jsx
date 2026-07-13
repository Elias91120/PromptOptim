import Layout from '../components/Layout';
import { Scale } from 'lucide-react';

const MentionsLegales = () => (
    <Layout>
        <div className="container max-w-3xl" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neon-glow-md)' }}>
                    <Scale style={{ width: '1.5rem', height: '1.5rem', color: 'var(--bg-primary)' }} />
                </div>
                <h1 className="page-title">Mentions Légales</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>

                <Section title="1. Éditeur du site">
                    <p>Le site <strong style={{ color: 'var(--text-primary)' }}>PromptOptim</strong> est édité dans le cadre d'un Projet de Fin d'Études (PFE).</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                        <li>Responsable de publication : Elias ELLOUMI</li>
                        <li>Email : e.elloumi15@gmail.com</li>
                        <li>Établissement : ECE Engineering School</li>
                        <li>Équipe PFE : Elias ELLOUMI, Noam, Marion, Mateo, Julien, Martin</li>
                        <li>Statut : Projet de Fin d'Études</li>
                    </ul>
                </Section>

                <Section title="2. Hébergement">
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                        <li>Hébergeur Frontend : Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
                        <li>Hébergeur Backend : Render — 525 Brannan St, San Francisco, CA 94107, USA</li>
                        <li>Base de données : Supabase — hébergement UE</li>
                    </ul>
                </Section>

                <Section title="3. Propriété intellectuelle">
                    <p>L'ensemble des contenus présents sur le site (textes, graphismes, logos, icônes, code source) est la propriété de l'éditeur ou fait l'objet d'une autorisation d'utilisation. Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sans autorisation est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
                </Section>

                <Section title="4. Responsabilité">
                    <p>L'éditeur s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes ou des résultats obtenus suite à l'utilisation de ces informations. L'optimisation de prompts est fournie à titre indicatif et ne constitue pas un conseil professionnel.</p>
                </Section>

                <Section title="5. Liens hypertextes">
                    <p>Le site peut contenir des liens vers d'autres sites. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
                </Section>

                <Section title="6. Droit applicable">
                    <p>Le présent site et ses mentions légales sont régis par le droit français. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux français.</p>
                </Section>
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

export default MentionsLegales;
