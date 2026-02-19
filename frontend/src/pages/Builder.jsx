import { useState, useEffect, lazy, Suspense, useContext } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../Button'
import Switch from '../components/Switch'
import BuildResult from '../components/BuildResult'
import Loading from '../components/Loading'
import ManualBuilder from '../components/ManualBuilder'
import AuthContext from '../context/AuthContext'

import { generateBuild } from '../utils/builderLogic'
import { generateManualBuildResult } from '../utils/manualBuilderUtils'

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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
`

const TabButton = styled(m.button)`
  background: ${props => props.active ? 'rgba(60, 32, 216, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? '#3c20d8' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#fff' : '#aaa'};
  backdrop-filter: blur(10px);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? 'rgba(60, 32, 216, 0.5)' : 'rgba(60, 32, 216, 0.15)'};
    color: #fff;
    border-color: #3c20d8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(60, 32, 216, 0.3);
  }
`

const ReasoningText = styled.p`
    color: #aaa;
    max-width: 600px;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    font-style: italic;
`

function Builder() {
    // AI Builder State
    const [buildResult, setBuildResult] = useState(null)
    const [isBuilding, setIsBuilding] = useState(false)
    const [selectedUseCase, setSelectedUseCase] = useState('')
    const [selectedTab, setSelectedTab] = useState(0)
    const [isManualMode, setIsManualMode] = useState(false)
    const navigate = useNavigate()

    // Manual Builder State (Lifted)
    const [components, setComponents] = useState({});
    const [manualSelections, setManualSelections] = useState({
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        psu: null,
        case: null,
    });
    const [targetResolution, setTargetResolution] = useState('1440p');
    const [isComponentsLoading, setIsComponentsLoading] = useState(true);

    // Fetch Components (Moved from ManualBuilder)
    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/components');
                const data = await res.json();
                const mappedData = {
                    ...data,
                    cpu: data.processor || [],
                    storage: [...(data.ssd || []), ...(data.hdd || [])],
                };
                setComponents(mappedData);
            } catch (error) {
                console.error('Failed to fetch components', error);
            } finally {
                setIsComponentsLoading(false);
            }
        };
        fetchComponents();

        // Check for pending build
        const pendingBuild = localStorage.getItem('pendingBuild');
        if (pendingBuild) {
            const { builds, useCase, tab } = JSON.parse(pendingBuild);
            setBuildResult(builds);
            setSelectedUseCase(useCase);
            setSelectedTab(tab);
            setIsBuilding(false);
            // Don't clear it yet, wait for the user to actually save it? 
            // Better to clear it so it doesn't persist on refresh if they navigate away?
            // Actually, if we just set state, it's fine. We should clear it to avoid it popping up unexpectedly later.
            localStorage.removeItem('pendingBuild');
        }
    }, []);

    const handleBuild = async (budget, useCase) => {
        setIsBuilding(true)
        setSelectedUseCase(useCase)
        setBuildResult(null)
        try {
            const result = await generateBuild(budget, useCase)
            if (result.builds && Array.isArray(result.builds)) {
                setBuildResult(result)
                setSelectedTab(result.builds.length > 1 ? 1 : 0)
            } else {
                setBuildResult(result)
            }
        } catch (error) {
            console.error(error)
            alert('Build failed: ' + error.message)
        } finally {
            setIsBuilding(false)
        }
    }

    const handleManualBuild = (result) => {
        setBuildResult(result)
        setSelectedTab(0)
    }

    const syncAiBuildToManual = (currentBuild) => {
        if (!currentBuild || !currentBuild.parts) return;

        const newSelections = {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
        };

        currentBuild.parts.forEach(part => {
            if (!part || !part.name) return;
            const typeKey = part.category.toLowerCase();

            // Try to find the full component object in our fetched components
            // 1. By ID (if AI preserved it)
            // 2. By Name (fallback)
            let fullComponent = null;
            const potentialList = components[typeKey];

            if (potentialList) {
                if (part._id) {
                    fullComponent = potentialList.find(c => c._id === part._id);
                }
                if (!fullComponent) {
                    fullComponent = potentialList.find(c => c.name === part.name);
                }
            }

            // If found, set it; otherwise use the part data itself (might be incomplete but better than null)
            newSelections[typeKey] = fullComponent || part;
        });

        setManualSelections(newSelections);
        return newSelections;
    };

    const handleEditPart = (partType) => {
        const currentBuild = buildResult?.builds ? buildResult.builds[selectedTab] : buildResult;

        // Always sync if we are editing an AI build (or if manual state is empty)
        // If it's already a 'Manual Build', we assume manualSelections is up to date
        if (currentBuild && (currentBuild.type !== 'Manual Build' || !manualSelections.cpu)) {
            syncAiBuildToManual(currentBuild);
        }

        setBuildResult(null); // Return to builder view
        setIsManualMode(true);
    };

    const handleDeletePart = (partType) => {
        const typeKey = partType.toLowerCase();

        // Ensure we have the current state synced
        let currentSelections = manualSelections;
        const currentBuild = buildResult?.builds ? buildResult.builds[selectedTab] : buildResult;

        // Force sync if deleting from an AI build
        if (currentBuild && (currentBuild.type !== 'Manual Build' || !manualSelections.cpu)) {
            currentSelections = syncAiBuildToManual(currentBuild);
        }

        const newSelections = { ...currentSelections, [typeKey]: null };
        setManualSelections(newSelections);

        // Regenerate the manual build result immediately
        const newBuild = generateManualBuildResult(newSelections, components, targetResolution);

        setBuildResult(prev => ({
            ...prev,
            builds: [newBuild],
            reasoning: newBuild.issues.length > 0 ? "Compatibility Issues Found" : "Custom Configuration"
        }));
        setSelectedTab(0); // CRITICAL: Reset tab to 0 as we now have only 1 build
    };

    const currentBuild = buildResult?.builds ? buildResult.builds[selectedTab] : buildResult

    const { user } = useContext(AuthContext);

    const handleSaveBuild = async () => {
        if (!user) {
            if (window.confirm("You need to be logged in to save your build. Would you like to log in now?")) {
                localStorage.setItem('pendingBuild', JSON.stringify({
                    builds: buildResult, // Save the full result object
                    useCase: selectedUseCase,
                    tab: selectedTab
                }));
                navigate('/login');
            }
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/users/save-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: user._id, build: currentBuild }),
            });

            if (res.ok) {
                alert('Build saved to your profile!');
            } else {
                alert('Failed to save build.');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving build.');
        }
    };

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

                    {/* Only show toggle if not building and no result yet */}
                    {!isBuilding && !buildResult && (
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <Switch isManual={isManualMode} onToggle={(val) => setIsManualMode(val)} />
                        </div>
                    )}

                    {isBuilding ? (
                        <Loading useCase={selectedUseCase || "High Performance"} />
                    ) : !buildResult ? (
                        isManualMode ? (
                            <ManualBuilder
                                onBuild={handleManualBuild}
                                selections={manualSelections}
                                setSelections={setManualSelections}
                                targetResolution={targetResolution}
                                setTargetResolution={setTargetResolution}
                            />
                        ) : (
                            <BuilderForm onBuild={handleBuild} isBuilding={isBuilding} />
                        )
                    ) : (
                        <>
                            {buildResult.reasoning && (
                                <ReasoningText>{buildResult.reasoning}</ReasoningText>
                            )}

                            {buildResult.builds && (
                                <TabsContainer>
                                    {buildResult.builds.map((b, index) => (
                                        <TabButton
                                            key={index}
                                            active={selectedTab === index}
                                            onClick={() => setSelectedTab(index)}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {b.type}
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                ₹{b.totalPrice.toLocaleString()}
                                            </div>
                                        </TabButton>
                                    ))}
                                </TabsContainer>
                            )}

                            <m.div
                                key={selectedTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                            >
                                <BuildResult
                                    build={currentBuild}
                                    useCase={selectedUseCase}
                                    onReset={() => {
                                        setBuildResult(null)
                                        setSelectedTab(0)
                                    }}
                                    onEdit={handleEditPart}
                                    onDelete={handleDeletePart}
                                    onSelect={handleEditPart} // Select logic is same as edit (go to builder)
                                    onSave={handleSaveBuild}
                                />
                            </m.div>
                        </>
                    )}
                </Container>
            </div>
        </LazyMotion>
    )
}

export default Builder
