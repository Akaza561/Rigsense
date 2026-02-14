export const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    // Helper to safely parse CSV line respecting quotes
    const parseLine = (line) => {
        const result = [];
        let current = '';
        let insideQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    return lines.slice(1).map(line => {
        const values = parseLine(line);
        const entry = {};

        headers.forEach((header, index) => {
            let value = values[index];

            // Type Conversion Logic
            if (header === 'price' || header === 'performance_score' || header === 'watt' || header === 'vram' || header === 'capacity') {
                value = parseFloat(value) || 0;
            }

            // Array Parsing for 'purpose' (e.g., "['Gaming', 'General']")
            if (header === 'purpose' && value && value.startsWith("['")) {
                value = value.replace(/'/g, '').replace('[', '').replace(']', '').split(',').map(v => v.trim());
            }

            entry[header] = value;
        });

        // Add ID if missing (using index or name hash)
        if (!entry.id) entry.id = entry.name + Math.random().toString(36).substr(2, 9);

        return entry;
    });
};
