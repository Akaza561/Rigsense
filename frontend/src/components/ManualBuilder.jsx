import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { m } from 'framer-motion';
import Button from '../Button';
import { generateManualBuildResult, calculateTotal } from '../utils/manualBuilderUtils';

const FormSection = styled(m.div)`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #00c2d4;
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-top: 1rem;
  color: #00c2d4;
  background: linear-gradient(135deg, #0099aaff, #00c2d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ManualBuilder = ({ onBuild, selections, setSelections, targetResolution, setTargetResolution }) => {
    const [components, setComponents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/components');
                const data = await res.json();

                // Map backend keys to frontend keys
                const mappedData = {
                    ...data,
                    cpu: data.processor || [],
                    storage: [...(data.ssd || []), ...(data.hdd || [])], // Combine SSD and HDD if present
                };

                setComponents(mappedData);
            } catch (error) {
                console.error('Failed to fetch components', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComponents();
    }, []);

    const handleChange = (partType, e) => {
        const partId = e.target.value;
        const part = components[partType]?.find(p => p._id === partId);
        setSelections(prev => ({ ...prev, [partType]: part }));
    };

    const handleBuildClick = () => {
        // Use utility to generate result
        const buildObject = generateManualBuildResult(selections, components, targetResolution);

        onBuild({
            builds: [buildObject],
            reasoning: buildObject.issues.length > 0 ? "Compatibility Issues Found" : "Custom Configuration"
        });
    };

    const partTypes = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case'];

    return (
        <FormSection
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <SectionTitle>Custom Selection</SectionTitle>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <SelectGroup style={{ width: '200px' }}>
                    <Label>Target Resolution</Label>
                    <Select
                        value={targetResolution}
                        onChange={(e) => setTargetResolution(e.target.value)}
                        style={{ borderColor: '#00e5ff' }}
                    >
                        <option value="1080p">1080p (FHD)</option>
                        <option value="1440p">1440p (2K)</option>
                        <option value="4K">4K (UHD)</option>
                    </Select>
                </SelectGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {partTypes.map(type => (
                    <SelectGroup key={type}>
                        <Label>{type.toUpperCase()}</Label>
                        <Select
                            value={selections[type]?._id || ""}
                            onChange={(e) => handleChange(type, e)}
                            disabled={loading}
                        >
                            <option value="">{loading ? "Loading..." : `Select ${type.toUpperCase()}`}</option>
                            {!loading && components[type]?.map(part => (
                                <option key={part._id} value={part._id}>
                                    {part.name} - ₹{part.price}
                                </option>
                            ))}
                        </Select>
                    </SelectGroup>
                ))}
            </div>

            <TotalPrice>Total: ₹{calculateTotal(selections).toLocaleString()}</TotalPrice>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button text="Finalize Build" onClick={handleBuildClick} />
            </div>
        </FormSection>
    );
};

export default ManualBuilder;
