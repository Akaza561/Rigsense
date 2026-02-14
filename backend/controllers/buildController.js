const Component = require('../models/Component');

const generateBuild = async (req, res) => {
    try {
        const { budget, useCase } = req.body;

        if (!budget || !useCase) {
            return res.status(400).json({ error: "Budget and Use Case are required." });
        }

        console.log(`[BUILD REQUEST] Budget: ₹${budget}, Use Case: ${useCase}`);

        // Fetch components from MongoDB
        const allParts = await Component.find({}).lean();

        if (allParts.length === 0) {
            return res.status(500).json({ error: "Database is empty. Please run seed script." });
        }

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
        const availableRamTypes = new Set(parts.ram.map(r => r.ram_type));
        const validMotherboards = parts.motherboard.filter(m => availableRamTypes.has(m.ram_type));
        const validSockets = new Set(validMotherboards.map(m => m.socket));
        const validCPUs = parts.cpu.filter(c => validSockets.has(c.socket));

        parts.motherboard = validMotherboards;
        parts.cpu = validCPUs;

        // --- BUDGET ALLOCATION ---
        let allocations = {
            gpu: 0.35, cpu: 0.20, motherboard: 0.12, ram: 0.10, storage: 0.10, psu: 0.08, case: 0.05
        };

        if (useCase === 'Gaming') {
            allocations.gpu = 0.45; allocations.cpu = 0.15;
        } else if (useCase === 'Programming') {
            allocations.gpu = 0.10; allocations.cpu = 0.35; allocations.ram = 0.20;
        } else if (useCase === 'Video Editing') {
            allocations.ram = 0.20; allocations.storage = 0.15;
        }

        const getPurposeTags = (u) => {
            switch (u) {
                case 'Gaming': return ['Gaming'];
                case 'Programming': return ['Gaming', 'Productivity', 'Content creation', 'General'];
                case 'Video Editing': return ['Editing', 'Content creation', '3D rendering'];
                case 'General Use': return ['General', 'Office', 'Productivity'];
                default: return [];
            }
        };

        const targetTags = getPurposeTags(useCase);
        const build = {};

        const pickPart = (category, categoryBudget, extraFilter = () => true) => {
            const filterFn = (p) => {
                if (!extraFilter(p)) return false;
                if (targetTags.length === 0) return true;
                const pTags = Array.isArray(p.purpose) ? p.purpose : [p.purpose];
                return pTags.some(t => targetTags.includes(t));
            };

            const available = parts[category].filter(filterFn);
            let candidates = available;
            if (candidates.length === 0) {
                candidates = parts[category].filter(extraFilter);
            }

            if (candidates.length === 0) return null;

            const inBudget = candidates.filter(p => p.price <= categoryBudget);

            if (inBudget.length === 0) {
                return candidates.sort((a, b) => a.price - b.price)[0];
            }

            inBudget.sort((a, b) => {
                const perfA = a.performance_score || 0;
                const perfB = b.performance_score || 0;
                if (perfB !== perfA) return perfB - perfA;
                return (a.price || 0) - (b.price || 0);
            });

            return inBudget[0];
        };

        // Execution
        build.cpu = pickPart('cpu', budget * allocations.cpu);
        if (!build.cpu) throw new Error("No compatible CPU found");

        build.motherboard = pickPart('motherboard', budget * allocations.motherboard, (m) => m.socket === build.cpu.socket);
        if (!build.motherboard) {
            build.motherboard = parts.motherboard.find(m => m.socket === build.cpu.socket);
            if (!build.motherboard) throw new Error(`No Motherboard found for socket ${build.cpu.socket}`);
        }

        const requiredRamType = build.motherboard.ram_type;
        build.ram = pickPart('ram', budget * allocations.ram, (r) => r.ram_type === requiredRamType);
        if (!build.ram) throw new Error(`No RAM found for type ${requiredRamType}`);

        build.gpu = pickPart('gpu', budget * allocations.gpu);
        if (!build.gpu) build.gpu = parts.gpu.sort((a, b) => a.price - b.price)[0];

        build.storage = pickPart('storage', budget * allocations.storage);
        if (!build.storage) build.storage = parts.storage[0];

        build.case = pickPart('case', budget * allocations.case);
        if (!build.case) build.case = parts.case[0];

        const estimatedWattage = (build.cpu.watt || 65) + (build.gpu.watt || 100) + 100;
        build.psu = pickPart('psu', budget * allocations.psu, (p) => p.watt >= estimatedWattage * 1.5);
        if (!build.psu) {
            build.psu = parts.psu.filter(p => p.watt >= estimatedWattage * 1.5).sort((a, b) => a.price - b.price)[0];
        }
        if (!build.psu) throw new Error("No sufficient PSU found");

        const result = {
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

        res.json(result);

    } catch (error) {
        console.error("Build Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate build" });
    }
};

module.exports = { generateBuild };
