import { Suspense, lazy, useContext, useState } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import '../index.css'
import Button from '../Button'
import ProductCard from '../ProductCard'
import AuthContext from '../context/AuthContext'
import UsernameModal from '../components/UsernameModal'

const AnoAI = lazy(() => import('../components/ui/animated-shader-background'))

/* ─── Data ───────────────────────────────────────────────── */
const STATS = [
    { value: '700+', label: 'PC Components' },
    { value: '3', label: 'Build Tiers' },
    { value: '100%', label: 'Compatibility Checked' },
    { value: '4', label: 'Use Cases' },
]

const STEPS = [
    { icon: '🎯', num: '01', title: 'Set Your Budget', body: 'Slide the budget dial to your price range. No hidden costs.' },
    { icon: '🧠', num: '02', title: 'Pick a Use Case', body: 'Gaming, Programming, Video Editing or General Use — we\'ll optimise for it.' },
    { icon: '⚡', num: '03', title: 'AI Picks the Parts', body: 'Our Python-backed engine scores every component for maximum value.' },
    { icon: '💾', num: '04', title: 'Save & Compare', body: 'Review 3 build tiers, save favourites to your profile, share anytime.' },
]

/* ─── Component ──────────────────────────────────────────── */
function Landing() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(true)

    return (
        <LazyMotion features={domAnimation}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <Suspense fallback={<div className="h-screen w-full bg-black" />}>
                    <AnoAI />
                </Suspense>

                {/* ── Hero ─────────────────────────────────── */}
                <div className="hero" style={{ height: '100vh', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '10vh' }}>
                    {user && !user.hasSetUsername && showModal && (
                        <UsernameModal onClose={() => setShowModal(false)} />
                    )}
                    <m.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="title">RIGSENSE</m.h1>
                    <m.p initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="description">
                        Craft your perfect rig — engineered for peak performance
                    </m.p>
                    <m.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ marginTop: '1rem', marginLeft: '3rem' }}>
                        <Button to="/build" />
                    </m.div>

                    {/* Scroll hint */}
                    <m.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>scroll</span>
                        <m.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
                    </m.div>
                </div>

                {/* ── Stats bar ────────────────────────────── */}
                <StatsBar>
                    {STATS.map((s, i) => (
                        <m.div key={i} className="stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                            <span className="val">{s.value}</span>
                            <span className="lbl">{s.label}</span>
                        </m.div>
                    ))}
                </StatsBar>

                {/* ── Feature cards ────────────────────────── */}
                <Section>
                    <SectionHeading
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }} viewport={{ once: true }}>
                        Why RigSense?
                    </SectionHeading>
                    <CardsRow>
                        {[
                            { title: 'Budget Optimized Builds', description: 'RigSense intelligently allocates your budget across CPU, GPU, RAM and storage to deliver maximum performance without overspending.' },
                            { title: 'Guaranteed Compatibility', description: 'Every build is validated with rule-based checks — CPU socket, RAM type, chipset — so you never buy mismatched parts.' },
                            { title: 'AI-Driven Recommendations', description: 'Our Python optimizer ranks components by performance-to-price ratio and produces three tailored build tiers.' },
                        ].map((c, i) => (
                            <m.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
                                <ProductCard title={c.title} description={c.description} />
                            </m.div>
                        ))}
                    </CardsRow>
                </Section>

                {/* ── How it works ─────────────────────────── */}
                <Section style={{ paddingBottom: '5rem' }}>
                    <SectionHeading
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }} viewport={{ once: true }}>
                        How It Works
                    </SectionHeading>
                    <StepsGrid>
                        {STEPS.map((s, i) => (
                            <m.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                                <StepCard>
                                    <StepNum>{s.num}</StepNum>
                                    <StepIcon>{s.icon}</StepIcon>
                                    <StepTitle>{s.title}</StepTitle>
                                    <StepBody>{s.body}</StepBody>
                                </StepCard>
                            </m.div>
                        ))}
                    </StepsGrid>
                </Section>

                {/* ── About Us ──────────────────────────── */}
                <AboutSection>
                    <m.div className="inner"
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }} viewport={{ once: true }}>
                        <span className="tag">ABOUT RIGSENSE</span>
                        <h2>Built by enthusiasts, for enthusiasts.</h2>
                        <p>
                            RigSense was born out of a simple frustration — building a PC shouldn't require hours
                            of spreadsheet research just to avoid buying incompatible parts. We combined a
                            lightweight Python AI engine with a real component database to deliver instant,
                            trustworthy recommendations for any budget.
                        </p>
                        <p>
                            Whether you're dropping ₹30,000 on your first rig or ₹3,00,000 on a workstation,
                            RigSense guides you with the same intelligence — no ads, no affiliate bias,
                            just honest performance-per-rupee analysis.
                        </p>
                        <div className="stack">
                            {['React + Vite', 'Node.js + Express', 'Python AI Engine', 'MongoDB Atlas', 'Firebase Auth'].map(t => (
                                <span key={t} className="chip">{t}</span>
                            ))}
                        </div>
                    </m.div>
                </AboutSection>

                {/* ── CTA ──────────────────────────────────── */}
                <CTASection>
                    <m.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                        Ready to build your dream rig?
                    </m.h2>
                    <m.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
                        Let RigSense do the heavy lifting — in seconds.
                    </m.p>
                    <m.button
                        onClick={() => navigate('/build')}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }} viewport={{ once: true }}>
                        Start Building →
                    </m.button>
                </CTASection>

                {/* ── Footer ───────────────────────────────── */}
                <Footer>
                    <span>© 2026 RigSense. Built for PC enthusiasts.</span>
                    <span style={{ color: '#555' }}>React · Node.js · Python AI · MongoDB</span>
                </Footer>

            </div>
        </LazyMotion>
    )
}

/* ─── Styled Components ──────────────────────────────────── */

const StatsBar = styled.div`
    position: relative; z-index: 1;
    display: flex; justify-content: center; flex-wrap: wrap; gap: 0;
    background: rgba(255,255,255,0.03);
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 2rem 1rem;
    .stat {
        display: flex; flex-direction: column; align-items: center;
        padding: 0 3rem;
        border-right: 1px solid rgba(255,255,255,0.07);
        &:last-child { border-right: none; }
    }
    .val {
        font-size: 2rem; font-weight: 800; color: #00c2d4;
        font-family: 'Inter', sans-serif;
    }
    .lbl { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.2rem; }
    @media (max-width: 600px) { .stat { padding: 1rem 1.5rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); &:last-child{border-bottom:none}; } }
`

const Section = styled.section`
    position: relative; z-index: 1;
    width: 100%; padding: 5rem 2rem 2rem;
    display: flex; flex-direction: column; align-items: center; gap: 3rem;
`

const SectionHeading = styled(m.h2)`
    font-size: 2rem; font-weight: 700; color: #fff;
    text-align: center; margin: 0;
    background: linear-gradient(to right, #fff, #888);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
`

const CardsRow = styled.div`
    display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem;
`

const StepsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1.5rem; width: 100%; max-width: 900px;
`

const StepCard = styled.div`
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 1.75rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    transition: border-color 0.25s;
    &:hover { border-color: rgba(0,194,212,0.35); }
`

const StepNum = styled.span`font-size: 0.7rem; font-weight: 700; color: #00c2d4; letter-spacing: 0.15em;`
const StepIcon = styled.span`font-size: 1.8rem; margin: 0.25rem 0;`
const StepTitle = styled.h3`font-size: 1rem; font-weight: 700; color: #fff; margin: 0;`
const StepBody = styled.p`font-size: 0.83rem; color: #777; margin: 0; line-height: 1.55;`

const AboutSection = styled.section`
    position: relative; z-index: 1;
    width: 100%; padding: 5rem 2rem;
    display: flex; justify-content: center;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);

    .inner {
        max-width: 700px; display: flex; flex-direction: column; gap: 1.2rem;
    }
    .tag {
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em;
        color: #00c2d4; text-transform: uppercase;
    }
    h2 {
        font-size: 2rem; font-weight: 800; color: #fff; margin: 0;
        line-height: 1.2;
    }
    p {
        font-size: 0.95rem; color: #777; line-height: 1.75; margin: 0;
    }
    .stack {
        display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.4rem;
    }
    .chip {
        padding: 0.3rem 0.9rem;
        background: rgba(0,194,212,0.08);
        border: 1px solid rgba(0,194,212,0.2);
        border-radius: 999px;
        font-size: 0.75rem; color: #00c2d4; font-weight: 600;
    }
`

const CTASection = styled.section`
    position: relative; z-index: 1;
    width: 100%; padding: 5rem 2rem 6rem;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1rem;
    background: radial-gradient(ellipse at center, rgba(0,194,212,0.06) 0%, transparent 70%);
    h2 { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0; }
    p { color: #777; font-size: 1rem; margin: 0; }
    button {
        margin-top: 1rem;
        padding: 0.85rem 2.2rem;
        background: linear-gradient(135deg, #0099aa, #00c2d4);
        color: #000; font-weight: 700; font-size: 1rem;
        border: none; border-radius: 12px; cursor: pointer;
        font-family: 'Inter', sans-serif;
    }
`

const Footer = styled.footer`
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 1.5rem 2rem;
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
    font-size: 0.78rem; color: #555;
    font-family: 'Inter', sans-serif;
`

export default Landing
