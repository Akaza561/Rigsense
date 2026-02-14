import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const parseLine = (line) => {
        const result = [];
        let current = '';
        let insideQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') insideQuote = !insideQuote;
            else if (char === ',' && !insideQuote) {
                result.push(current.trim());
                current = '';
            } else current += char;
        }
        result.push(current.trim());
        return result;
    };

    return lines.slice(1).map(line => {
        const values = parseLine(line);
        const entry = {};
        headers.forEach((header, index) => {
            let value = values[index];
            if (['price', 'performance_score', 'watt', 'vram', 'capacity'].includes(header)) {
                value = parseFloat(value) || 0;
            }
            if (header === 'purpose' && value && value.startsWith("['")) {
                value = value.replace(/'/g, '').replace('[', '').replace(']', '').split(',').map(v => v.trim());
            }
            entry[header] = value;
        });
        if (!entry.id) entry.id = entry.name + Math.random().toString(36).substr(2, 9);
        return entry;
    });
};

const generateBuild = async (budget, useCase) => {

    const csvPath = path.join(__dirname, '../public/data/components.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    const allParts = parseCSV(csvText);

    const parts = {
        cpu: allParts.filter(p => p.part === 'processor'),
        gpu: allParts.filter(p => p.part === 'gpu'),
        ram: allParts.filter(p => p.part === 'ram'),
        motherboard: allParts.filter(p => p.part === 'motherboard'),
        storage: allParts.filter(p => p.part === 'ssd'),
        psu: allParts.filter(p => p.part === 'psu'),
        case: allParts.filter(p => p.part === 'case'),
    };

    console.log("Unique RAM Types in Data:", [...new Set(parts.ram.map(r => r.ram_type))]);
    console.log("Unique Mobo RAM Types:", [...new Set(parts.motherboard.map(m => m.ram_type))]);

    // Filter CPUs/Mobos by available RAM types
    const availableRamTypes = new Set(parts.ram.map(r => r.ram_type));

    // Filter Motherboards to only those that support available RAM
    const validMotherboards = parts.motherboard.filter(m => availableRamTypes.has(m.ram_type));

    // Filter CPUs to only those with sockets on valid motherboards
    const validSockets = new Set(validMotherboards.map(m => m.socket));
    const validCPUs = parts.cpu.filter(c => validSockets.has(c.socket));

    console.log(`Original CPUs: ${parts.cpu.length}, Valid CPUs (RAM-Check): ${validCPUs.length}`);

    // Use valid parts list
    parts.motherboard = validMotherboards;
    parts.cpu = validCPUs;

    let allocations = {
        gpu: 0.35, cpu: 0.20, motherboard: 0.12, ram: 0.10, storage: 0.10, psu: 0.08, case: 0.05
    };

    if (useCase === 'Gaming') {
        allocations.gpu = 0.45; allocations.cpu = 0.15;
    } else if (useCase === 'Programming') {
        allocations.gpu = 0.10; allocations.cpu = 0.35; allocations.ram = 0.20;
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

    try {
        build.cpu = pickPart('cpu', budget * allocations.cpu);
        if (!build.cpu) throw new Error("No compatible CPU found");

        build.motherboard = pickPart('motherboard', budget * allocations.motherboard,
            (m) => m.socket === build.cpu.socket
        );
        if (!build.motherboard) {
            build.motherboard = parts.motherboard.find(m => m.socket === build.cpu.socket);
            if (!build.motherboard) throw new Error(`No Motherboard found for socket ${build.cpu.socket}`);
        }

        const requiredRamType = build.motherboard.ram_type;
        // console.log(`Required RAM type: ${requiredRamType}`);

        build.ram = pickPart('ram', budget * allocations.ram,
            (r) => r.ram_type === requiredRamType
        );
        if (!build.ram) throw new Error(`No RAM found for type ${requiredRamType}`);

        build.gpu = pickPart('gpu', budget * allocations.gpu);
        if (!build.gpu) build.gpu = parts.gpu.sort((a, b) => a.price - b.price)[0];

        build.storage = pickPart('storage', budget * allocations.storage);
        if (!build.storage) build.storage = parts.storage[0];

        build.case = pickPart('case', budget * allocations.case);
        if (!build.case) build.case = parts.case[0];

        const estimatedWattage = (build.cpu.watt || 65) + (build.gpu.watt || 100) + 100;
        build.psu = pickPart('psu', budget * allocations.psu,
            (p) => p.watt >= estimatedWattage * 1.5
        );
        if (!build.psu) build.psu = parts.psu.filter(p => p.watt >= estimatedWattage * 1.5).sort((a, b) => a.price - b.price)[0];
        if (!build.psu) throw new Error("No sufficient PSU found");

        return {
            totalPrice: Object.values(build).reduce((acc, part) => acc + (part?.price || 0), 0),
            parts: build
        };
    } catch (e) {
        throw e;
    }
};

(async () => {
    try {
        // Run once to see logging
        const res = await generateBuild(150000, 'General Use');
        console.log("Build Success!");
    } catch (e) {
        console.error("Build Failed:", e.message);
    }
})();
