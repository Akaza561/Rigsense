import { parseCSV } from './csvParser';

export const generateBuild = async (budget, useCase) => {
    try {
        // Fetch and parse data
        const response = await fetch('/data/components.csv');
        const csvText = await response.text();
        const allParts = parseCSV(csvText);

        // Group parts by category
        const parts = {
            cpu: allParts.filter(p => p.part === 'processor'),
            gpu: allParts.filter(p => p.part === 'gpu'),
            ram: allParts.filter(p => p.part === 'ram'),
            motherboard: allParts.filter(p => p.part === 'motherboard'),
            storage: allParts.filter(p => p.part === 'ssd'),
            psu: allParts.filter(p => p.part === 'psu'),
            case: allParts.filter(p => p.part === 'case'),
        };

        // --- PLATFORM VALIDATION ---
        // 1. Check what RAM types are actually available in the data
        const availableRamTypes = new Set(parts.ram.map(r => r.ram_type));

        // 2. Filter Motherboards to only those that support available RAM
        // This prevents picking a DDR5 motherboard if no DDR5 RAM exists in data
        const validMotherboards = parts.motherboard.filter(m => availableRamTypes.has(m.ram_type));

        // 3. Filter CPUs to only those compatible with the VALID motherboards
        const validSockets = new Set(validMotherboards.map(m => m.socket));
        const validCPUs = parts.cpu.filter(c => validSockets.has(c.socket));

        // Replace original lists with valid ones
        parts.motherboard = validMotherboards;
        parts.cpu = validCPUs;

        // --- BUDGET ALLOCATION ---
        let allocations = {
            gpu: 0.35,
            cpu: 0.20,
            motherboard: 0.12,
            ram: 0.10,
            storage: 0.10,
            psu: 0.08,
            case: 0.05
        };

        if (useCase === 'Gaming') {
            allocations.gpu = 0.45;
            allocations.cpu = 0.15;
        } else if (useCase === 'Programming') {
            allocations.gpu = 0.10;
            allocations.cpu = 0.35;
            allocations.ram = 0.20;
        } else if (useCase === 'Video Editing') {
            allocations.ram = 0.20;
            allocations.storage = 0.15;
        }

        // --- PURPOSE MAPPING ---
        // Map UI Use Cases to CSV Purpose Tags
        const getPurposeTags = (u) => {
            switch (u) {
                case 'Gaming': return ['Gaming'];
                // Programming needs good CPU/RAM, can use 'Productivity' or 'Content creation' parts
                case 'Programming': return ['Gaming', 'Productivity', 'Content creation', 'General'];
                case 'Video Editing': return ['Editing', 'Content creation', '3D rendering'];
                case 'General Use': return ['General', 'Office', 'Productivity'];
                default: return [];
            }
        };

        const targetTags = getPurposeTags(useCase);
        const build = {};

        // --- SELECTION ENGINE ---
        const pickPart = (category, categoryBudget, extraFilter = () => true) => {
            // Filter Mechanism:
            // 1. Matches extra specific criteria (socket, ram_type)
            // 2. Matches at least one Purpose Tag (if tags exist)
            const filterFn = (p) => {
                if (!extraFilter(p)) return false;

                // If no use case selected or no tags mapped, rely purely on specs
                if (targetTags.length === 0) return true;

                // Check tags
                const pTags = Array.isArray(p.purpose) ? p.purpose : [p.purpose];
                // Loop through part tags and see if any match our target tags
                return pTags.some(t => targetTags.includes(t));
            };

            const available = parts[category].filter(filterFn);

            // FALLBACK 1: Relax Purpose Filter
            // If we found NO parts with the specific tags (e.g. no "Office" GPU),
            // fall back toANY part that matches the technical specs (extraFilter).
            let candidates = available;
            if (candidates.length === 0) {
                candidates = parts[category].filter(extraFilter);
            }

            if (candidates.length === 0) return null;

            // Budget Filtering
            const inBudget = candidates.filter(p => p.price <= categoryBudget);

            // FALLBACK 2: Budget Overflow
            // If no parts fit in budget, find the cheapest compatible one.
            if (inBudget.length === 0) {
                return candidates.sort((a, b) => a.price - b.price)[0];
            }

            // SORTING: Performance > Price
            // Prioritize highest performance within budget.
            // If performance is identical, pick the cheaper one.
            inBudget.sort((a, b) => {
                const perfA = a.performance_score || 0;
                const perfB = b.performance_score || 0;
                if (perfB !== perfA) return perfB - perfA; // Higher score first
                return (a.price || 0) - (b.price || 0); // Tweaker
            });

            return inBudget[0];
        };

        // 1. Pick CPU
        build.cpu = pickPart('cpu', budget * allocations.cpu);
        if (!build.cpu) throw new Error("No compatible CPU found for this budget/use case");

        // 2. Pick Motherboard
        build.motherboard = pickPart('motherboard', budget * allocations.motherboard,
            (m) => m.socket === build.cpu.socket
        );
        if (!build.motherboard) {
            // Strict fallback
            build.motherboard = parts.motherboard.find(m => m.socket === build.cpu.socket);
            if (!build.motherboard) throw new Error(`No Motherboard found for socket ${build.cpu.socket}`);
        }

        // 3. Pick RAM
        const requiredRamType = build.motherboard.ram_type;
        build.ram = pickPart('ram', budget * allocations.ram,
            (r) => r.ram_type === requiredRamType
        );
        if (!build.ram) throw new Error(`No RAM found for type ${requiredRamType}`);

        // 4. Pick GPU
        build.gpu = pickPart('gpu', budget * allocations.gpu);
        // GPU Fallback to cheapest if none found (e.g. strict budget)
        if (!build.gpu) build.gpu = parts.gpu.sort((a, b) => a.price - b.price)[0];

        // 5. Pick Storage
        build.storage = pickPart('storage', budget * allocations.storage);
        if (!build.storage) build.storage = parts.storage[0];

        // 6. Pick Case
        build.case = pickPart('case', budget * allocations.case);
        if (!build.case) build.case = parts.case[0];

        // 7. Pick PSU
        const estimatedWattage = (build.cpu.watt || 65) + (build.gpu.watt || 100) + 100;
        build.psu = pickPart('psu', budget * allocations.psu,
            (p) => p.watt >= estimatedWattage * 1.5
        );
        if (!build.psu) {
            build.psu = parts.psu.filter(p => p.watt >= estimatedWattage * 1.5)
                .sort((a, b) => a.price - b.price)[0];
        }
        if (!build.psu) throw new Error("No sufficient PSU found");

        return {
            totalPrice: Object.values(build).reduce((acc, part) => acc + (part?.price || 0), 0),
            parts: [
                { category: 'CPU', ...build.cpu },
                { category: 'Motherboard', ...build.motherboard },
                { category: 'GPU', ...build.gpu },
                { category: 'RAM', ...build.ram },
                { category: 'Storage', ...build.storage },
                { category: 'Case', ...build.case },
                { category: 'PSU', ...build.psu },
            ]
        };

    } catch (error) {
        console.error("Build Failed:", error);
        throw error;
    }
};
