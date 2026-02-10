import { Suspense, lazy } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import '../index.css'
import Button from '../Button'
import SimpleButton from '../SimpleButton'
import Radio from '../Radio'
import Card from '../Card'
import ProductCard from '../ProductCard'
import AuthButton from '../AuthButton'

const AnoAI = lazy(() => import('../components/ui/animated-shader-background'))

function Landing() {
    return (
        <LazyMotion features={domAnimation}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <Suspense fallback={<div className="h-screen w-full bg-black" />}>
                    <AnoAI />
                </Suspense>
                <div className="hero" style={{ height: '100vh', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '0rem', paddingLeft: '10vh' }}>
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ position: 'absolute', top: '20px', left: '20px' }}>
                        <SimpleButton />
                    </m.div>
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <AuthButton text="Log In / Register" />
                        <Radio />
                    </m.div>
                    <m.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="title">RIGSENSE</m.h1>
                    <m.p
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="description">
                        Craft your perfect rig — engineered for peak performance
                    </m.p>

                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{ marginTop: '1rem', marginLeft: '3rem' }}
                    >
                        <Button to="/build" />
                    </m.div>
                </div>
                <div className="content" style={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', padding: '2rem' }}>
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <ProductCard
                            title="Budget Optimized Builds"
                            description="RigSense analyzes your budget and intelligently allocates it across CPU, GPU, RAM, and storage to deliver maximum performance without overspending."
                        />
                    </m.div>
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <ProductCard
                            title="Guaranteed Compatibility"
                            description="Every recommended build is validated using rule-based compatibility checks, ensuring perfect matching between CPU sockets, RAM types, and chipsets."
                        />
                    </m.div>
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <ProductCard
                            title="AI-Driven Recommendations"
                            description="RigSense ranks components using performance-to-price analysis and suggests the best possible configuration based on your use case."
                        />
                    </m.div>
                    <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                        <Card />
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    )
}

export default Landing
