import { useState, lazy, Suspense } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import styled from 'styled-components'
import Button from '../Button'
import BuildResult from '../components/BuildResult'
import Loading from '../components/Loading'

import { generateBuild } from '../utils/builderLogic'

const AnoAI = lazy(() => import('../components/ui/animated-shader-background'))

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: transparent;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
`

const Title = styled(m.h2)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const FormSection = styled(m.div)`
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 500;
  color: #ccc;
  margin-bottom: 0.5rem;
  display: block;
`

const RangeInput = styled.input`
  width: 100%;
  accent-color: #3c20d8;
  margin-top: 1rem;
`

const PriceDisplay = styled.span`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #291dd1ff, #3c20d8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  text-align: center;
  margin-top: 0.5rem;
`

const UseCaseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const UseCaseCard = styled.div`
  background: ${props => props.selected ? 'rgba(41, 29, 209, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.selected ? '#3c20d8' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${props => props.selected ? '0 0 20px rgba(58, 12, 163, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.selected ? 'rgba(41, 29, 209, 0.4)' : 'rgba(41, 29, 209, 0.1)'};
    border-color: #3c20d8;
  }
`



function BuilderForm({ onBuild, isBuilding }) {
    const [budget, setBudget] = useState(50000)
    const [useCase, setUseCase] = useState('')

    const useCases = ['Gaming', 'Programming', 'Video Editing', 'General Use']

    return (
        <FormSection
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div>
                <Label>Budget (INR)</Label>
                <PriceDisplay>₹{budget.toLocaleString()}</PriceDisplay>
                <RangeInput
                    type="range"
                    min="30000"
                    max="500000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                />
            </div>

            <div>
                <Label>Primary Use Case</Label>
                <UseCaseGrid>
                    {useCases.map((uc) => (
                        <UseCaseCard
                            key={uc}
                            selected={useCase === uc}
                            onClick={() => setUseCase(uc)}
                        >
                            {uc}
                        </UseCaseCard>
                    ))}
                </UseCaseGrid>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Button
                    text={isBuilding ? "Building..." : "Get Rigged"}
                    onClick={() => {
                        if (!useCase) return alert('Please select a use case')
                        onBuild(budget, useCase)
                    }}
                />
            </div>
        </FormSection>
    )
}

function Builder() {
    const [buildResult, setBuildResult] = useState(null)
    const [isBuilding, setIsBuilding] = useState(false)
    const [selectedUseCase, setSelectedUseCase] = useState('')

    const handleBuild = async (budget, useCase) => {
        setIsBuilding(true)
        setSelectedUseCase(useCase)
        try {
            const result = await generateBuild(budget, useCase)
            setBuildResult(result)
        } catch (error) {
            console.error(error)
            alert('Build failed: ' + error.message)
        } finally {
            setIsBuilding(false)
        }
    }

    return (
        <LazyMotion features={domAnimation}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <Suspense fallback={<div className="h-screen w-full bg-black" />}>
                    <AnoAI />
                </Suspense>
                <Container>
                    <Title
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Configure Your Build
                    </Title>
                    {isBuilding ? (
                        <Loading />
                    ) : !buildResult ? (
                        <BuilderForm onBuild={handleBuild} isBuilding={isBuilding} />
                    ) : (
                        <BuildResult
                            build={buildResult}
                            useCase={selectedUseCase}
                            onReset={() => setBuildResult(null)}
                        />
                    )}
                </Container>
            </div>
        </LazyMotion>
    )
}

export default Builder
