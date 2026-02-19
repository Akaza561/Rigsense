export const calculateTotal = (selections) => {
    return Object.values(selections).reduce((total, part) => total + (part?.price || 0), 0);
};

export const validateBuild = (selections) => {
    const issues = [];
    const { cpu, motherboard, ram, gpu, psu } = selections;

    // 1. Socket Compatibility
    if (cpu && motherboard) {
        if (cpu.socket !== motherboard.socket) {
            issues.push(`Compatibility Error: CPU Socket (${cpu.socket}) does not match Motherboard Socket (${motherboard.socket}).`);
        }
    }

    // 2. RAM Compatibility
    if (ram && motherboard) {
        const ramType = ram.ram_type?.toUpperCase();
        const moboRamType = motherboard.ram_type?.toUpperCase();

        if (ramType && moboRamType && !moboRamType.includes(ramType)) {
            issues.push(`Compatibility Error: RAM Type (${ramType}) is not supported by Motherboard (${moboRamType}).`);
        }
    }

    // 3. Power Supply (PSU) Check
    if (psu) {
        const cpuWatt = cpu?.watt || 0;
        const gpuWatt = gpu?.watt || 0;
        const estimatedLoad = cpuWatt + gpuWatt + 100;

        if (psu.watt < estimatedLoad) {
            issues.push(`Power Warning: PSU Wattage (${psu.watt}W) may be insufficient. Estimated Load: ${estimatedLoad}W.`);
        }
    }

    return issues;
};

export const checkBottlenecks = (selections, components, targetResolution = '1440p') => {
    const { cpu, gpu, ram, motherboard } = selections;
    const bottlenecks = [];

    if (!cpu || !gpu) return bottlenecks;

    // Base Performance Scores
    let cpuScore = cpu.performance_score || 0;
    let gpuScore = gpu.performance_score || 0;

    // Adjust scores based on Resolution
    if (targetResolution === '1080p') {
        cpuScore *= 0.9;
        gpuScore *= 1.1;
    } else if (targetResolution === '4K') {
        gpuScore *= 0.8;
        cpuScore *= 1.1;
    }

    // Calculate Bottleneck Percentage
    const maxScore = Math.max(cpuScore, gpuScore);
    const minScore = Math.min(cpuScore, gpuScore);
    const bottleneckPct = ((maxScore - minScore) / maxScore) * 100;

    if (bottleneckPct > 15) {
        const isGpuBottleneck = gpuScore < cpuScore;
        const type = isGpuBottleneck ? "GPU Bottleneck" : "CPU Bottleneck";
        let suggestion = null;

        // Simple Suggestion Logic
        if (isGpuBottleneck) {
            // Find a GPU closer to CPU Score
            const viableGpus = components.gpu?.filter(g =>
                g.performance_score >= (cpuScore * 0.8) &&
                g.price < (gpu.price * 3)
            ).sort((a, b) => a.price - b.price);

            if (viableGpus && viableGpus.length > 0) {
                suggestion = viableGpus.find(g => g.performance_score > gpuScore) || viableGpus[0];
            }
        } else {
            // Find a CPU closer to GPU Score
            const currentSocket = motherboard?.socket || cpu.socket;
            const viableCpus = components.cpu?.filter(c =>
                c.performance_score >= (gpuScore * 0.8) &&
                (!currentSocket || c.socket === currentSocket)
            ).sort((a, b) => a.price - b.price);

            if (viableCpus && viableCpus.length > 0) {
                suggestion = viableCpus.find(c => c.performance_score > cpuScore) || viableCpus[0];
            }
        }

        bottlenecks.push({
            type,
            percentage: bottleneckPct.toFixed(1),
            details: isGpuBottleneck
                ? `GPU is too weak for this CPU at ${targetResolution}.`
                : `CPU is too weak for this GPU at ${targetResolution}.`,
            suggestion
        });
    }

    // RAM Check
    const ramSize = ram?.capacity || (ram?.name?.includes('16GB') ? 16 : 8);
    if (ram && ramSize < 16) {
        bottlenecks.push({
            type: "Low RAM",
            percentage: null,
            details: "8GB RAM is insufficient for modern gaming. 16GB+ recommended.",
            suggestion: components.ram?.find(r => r.name.includes('16GB') || r.price > ram.price)
        });
    }

    // VRAM Check
    if (gpu?.vram) {
        const minVram = targetResolution === '4K' ? 12 : (targetResolution === '1440p' ? 10 : 8);
        if (gpu.vram < minVram) {
            bottlenecks.push({
                type: "Low VRAM",
                percentage: null,
                details: `Recommended VRAM for ${targetResolution} is ${minVram}GB+.`,
                suggestion: null
            });
        }
    }

    return bottlenecks;
};

export const generateManualBuildResult = (selections, components, targetResolution) => {
    const issues = validateBuild(selections);
    const bottlenecks = checkBottlenecks(selections, components, targetResolution);
    const total = calculateTotal(selections);

    // Create parts array including NULLs for missing parts
    const partTypes = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case'];
    const parts = partTypes.map(type => {
        const part = selections[type];
        if (!part) {
            return { category: type.toUpperCase(), name: null };
        }
        return {
            category: type.toUpperCase(),
            name: part.name,
            price: part.price,
            performance_score: part.performance_score,
            watt: part.watt,
            params: part
        };
    });

    return {
        parts: parts,
        totalPrice: total,
        type: 'Manual Build',
        issues: issues,
        bottlenecks: bottlenecks,
        compatibilityScore: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 20))
    };
};
