// Normalize socket/type strings: strip whitespace, uppercase
// e.g. "LGA 1700" === "LGA1700" after normalization
const norm = (s) => (s || '').replace(/\s+/g, '').toUpperCase();

export const calculateTotal = (selections) => {
    return Object.values(selections).reduce((total, part) => total + (part?.price || 0), 0);
};

export const validateBuild = (selections, components = {}) => {
    const issues = [];
    const { cpu, motherboard, ram, gpu, psu } = selections;

    // 1. Socket Compatibility — suggest a compatible motherboard or CPU
    if (cpu && motherboard) {
        if (norm(cpu.socket) !== norm(motherboard.socket)) {
            const cpuSockNorm = norm(cpu.socket);
            const moboSockNorm = norm(motherboard.socket);

            // Suggest: mobo with same socket as CPU, closest price
            const fixMobo = (components.motherboard || [])
                .filter(m => norm(m.socket) === cpuSockNorm)
                .sort((a, b) => Math.abs(a.price - motherboard.price) - Math.abs(b.price - motherboard.price))[0];

            // Suggest: CPU with same socket as mobo, closest price
            const fixCpu = (components.cpu || components.processor || [])
                .filter(c => norm(c.socket) === moboSockNorm)
                .sort((a, b) => Math.abs(a.price - cpu.price) - Math.abs(b.price - cpu.price))[0];

            issues.push({
                message: `CPU Socket (${cpu.socket}) does not match Motherboard Socket (${motherboard.socket}).`,
                affectedParts: ['cpu', 'motherboard'],
                fixes: [
                    fixMobo && {
                        label: 'Replace Motherboard',
                        partKey: 'motherboard',
                        part: fixMobo,
                        reason: `${fixMobo.name} supports ${cpu.socket} socket — compatible with your CPU.`,
                    },
                    fixCpu && {
                        label: 'Replace CPU',
                        partKey: 'cpu',
                        part: fixCpu,
                        reason: `${fixCpu.name} uses ${motherboard.socket} socket — compatible with your Motherboard.`,
                    },
                ].filter(Boolean),
            });
        }
    }

    // 2. RAM Type Compatibility — suggest compatible RAM
    if (ram && motherboard) {
        const ramType = norm(ram.ram_type);
        const moboRamType = norm(motherboard.ram_type);

        if (ramType && moboRamType && !moboRamType.includes(ramType)) {
            const fixRam = (components.ram || [])
                .filter(r => moboRamType.includes(norm(r.ram_type)))
                .sort((a, b) => Math.abs(a.price - ram.price) - Math.abs(b.price - ram.price))[0];

            issues.push({
                message: `RAM Type (${ram.ram_type}) is not supported by your Motherboard (requires ${motherboard.ram_type}).`,
                affectedParts: ['ram'],
                fixes: fixRam ? [{
                    label: 'Replace RAM',
                    partKey: 'ram',
                    part: fixRam,
                    reason: `${fixRam.name} uses ${fixRam.ram_type?.toUpperCase()} — compatible with your Motherboard.`,
                }] : [],
            });
        }
    }

    // 3. PSU Wattage — suggest a more powerful PSU
    if (psu) {
        const cpuWatt = cpu?.watt || 0;
        const gpuWatt = gpu?.watt || 0;
        const estimatedLoad = cpuWatt + gpuWatt + 100;

        if (psu.watt < estimatedLoad) {
            const fixPsu = (components.psu || [])
                .filter(p => p.watt >= estimatedLoad)
                .sort((a, b) => a.price - b.price)[0];

            issues.push({
                message: `PSU wattage (${psu.watt}W) is insufficient. Estimated system load: ${estimatedLoad}W.`,
                affectedParts: ['psu'],
                fixes: fixPsu ? [{
                    label: 'Replace PSU',
                    partKey: 'psu',
                    part: fixPsu,
                    reason: `${fixPsu.name} provides ${fixPsu.watt}W — enough headroom for your CPU + GPU.`,
                }] : [],
            });
        }
    }

    return issues;
};


export const checkBottlenecks = (selections, components, targetResolution = '1440p', useCase = 'Gaming') => {
    const { cpu, gpu, ram, motherboard } = selections;
    const bottlenecks = [];
    const isGaming = useCase === 'Gaming';

    if (!cpu || !gpu) return bottlenecks;

    // Base Performance Scores
    let cpuScore = cpu.performance_score || 0;
    let gpuScore = gpu.performance_score || 0;

    // GPU/CPU bottleneck — only relevant for gaming
    if (isGaming) {
        // Adjust scores based on resolution
        if (targetResolution === '1080p') { cpuScore *= 0.9; gpuScore *= 1.1; }
        else if (targetResolution === '4K') { gpuScore *= 0.8; cpuScore *= 1.1; }

        const maxScore = Math.max(cpuScore, gpuScore);
        const minScore = Math.min(cpuScore, gpuScore);
        const bottleneckPct = ((maxScore - minScore) / maxScore) * 100;

        if (bottleneckPct > 15) {
            const isGpuBottleneck = gpuScore < cpuScore;
            const type = isGpuBottleneck ? 'GPU Bottleneck' : 'CPU Bottleneck';
            let suggestion = null;

            if (isGpuBottleneck) {
                const viableGpus = components.gpu?.filter(g =>
                    g.performance_score >= (cpuScore * 0.8) && g.price < (gpu.price * 3)
                ).sort((a, b) => a.price - b.price);
                if (viableGpus?.length > 0) {
                    suggestion = viableGpus.find(g => g.performance_score > gpuScore) || viableGpus[0];
                }
            } else {
                const currentSocket = motherboard?.socket || cpu.socket;
                const viableCpus = components.cpu?.filter(c =>
                    c.performance_score >= (gpuScore * 0.8) &&
                    (!currentSocket || norm(c.socket) === norm(currentSocket))
                ).sort((a, b) => a.price - b.price);
                if (viableCpus?.length > 0) {
                    suggestion = viableCpus.find(c => c.performance_score > cpuScore) || viableCpus[0];
                }
            }

            bottlenecks.push({
                type,
                percentage: bottleneckPct.toFixed(1),
                details: isGpuBottleneck
                    ? `GPU is too weak for this CPU at ${targetResolution}.`
                    : `CPU is too weak for this GPU at ${targetResolution}.`,
                suggestion,
            });
        }
    }

    // RAM Check — wording adapts to use case
    const ramSize = ram?.capacity || (ram?.name?.includes('16GB') ? 16 : 8);
    if (ram && ramSize < 16) {
        const ramDetails = useCase === 'Video Editing'
            ? '16GB+ RAM is recommended for smooth video editing. 32GB ideal for 4K.'
            : useCase === 'Programming'
                ? '16GB+ RAM is recommended for running IDEs, compilers, and virtual machines.'
                : '8GB RAM is insufficient for modern workloads. 16GB+ recommended.';
        bottlenecks.push({
            type: 'Low RAM',
            percentage: null,
            details: ramDetails,
            suggestion: components.ram?.find(r => r.name?.includes('16GB') || r.price > ram.price),
        });
    }

    // VRAM Check — only meaningful for gaming
    if (isGaming && gpu?.vram) {
        const minVram = targetResolution === '4K' ? 12 : (targetResolution === '1440p' ? 10 : 8);
        if (gpu.vram < minVram) {
            bottlenecks.push({
                type: 'Low VRAM',
                percentage: null,
                details: `Recommended VRAM for gaming at ${targetResolution} is ${minVram}GB+.`,
                suggestion: null,
            });
        }
    }

    return bottlenecks;
};


/**
 * For each selected part, find a better alternative in the same category.
 * "Better" = higher performance_score at a reasonable price bump (< 40% more).
 */
const generatePartSuggestions = (selections, components) => {
    const suggestions = {};
    const partTypes = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case'];

    partTypes.forEach(type => {
        const current = selections[type];
        if (!current) return;

        const pool = components[type];
        if (!pool || pool.length === 0) return;

        const curScore = current.performance_score || 0;
        const curPrice = current.price || 0;
        const maxPrice = curPrice * 1.4; // up to 40% more expensive

        // Find candidates: higher score, within budget, compatible socket for CPU/mobo
        let candidates = pool.filter(c => {
            if (c._id === current._id || c.name === current.name) return false;
            if ((c.performance_score || 0) <= curScore) return false;
            if (c.price > maxPrice) return false;

            // Socket compatibility for CPU
            if (type === 'cpu' && selections.motherboard) {
                if (c.socket && selections.motherboard.socket && norm(c.socket) !== norm(selections.motherboard.socket)) return false;
            }
            // Socket compatibility for mobo
            if (type === 'motherboard' && selections.cpu) {
                if (c.socket && selections.cpu.socket && norm(c.socket) !== norm(selections.cpu.socket)) return false;
            }
            // RAM type compatibility
            if (type === 'ram' && selections.motherboard) {
                const moboRam = norm(selections.motherboard.ram_type);
                const candidateRam = norm(c.ram_type);
                if (moboRam && candidateRam && !moboRam.includes(candidateRam)) return false;
            }
            return true;
        });

        // Sort by best value (score per rupee)
        candidates.sort((a, b) => {
            const valA = (a.performance_score || 0) / (a.price || 1);
            const valB = (b.performance_score || 0) / (b.price || 1);
            return valB - valA;
        });

        if (candidates.length > 0) {
            const best = candidates[0];
            const scoreDiff = (best.performance_score || 0) - curScore;
            const priceDiff = best.price - curPrice;

            let reason = `+${scoreDiff} perf score`;
            if (priceDiff <= 0) reason += `, ₹${Math.abs(priceDiff).toLocaleString()} cheaper`;
            else reason += ` for just ₹${priceDiff.toLocaleString()} more`;

            suggestions[type.toUpperCase()] = {
                name: best.name,
                price: best.price,
                performance_score: best.performance_score,
                reason,
            };
        }
    });

    return suggestions;
};

export const generateManualBuildResult = (selections, components, targetResolution, useCase = 'Gaming') => {
    const issues = validateBuild(selections, components);
    const bottlenecks = checkBottlenecks(selections, components, targetResolution, useCase);
    const total = calculateTotal(selections);
    const upgrades = generatePartSuggestions(selections, components);

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
            params: part,
            upgrade: upgrades[type.toUpperCase()] || null,
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
