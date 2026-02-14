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
            // Array Parsing for 'purpose' (e.g., "['Gaming', 'General']")
            if (header === 'purpose' && value && value.startsWith("[")) {
                // Remove quotes and brackets to parse array string
                value = value.replace(/'/g, '').replace('[', '').replace(']', '').split(',').map(v => v.trim());
            } else if (header === 'purpose' && !value) {
                value = [];
            }

            entry[header] = value;
        });
        if (!entry.id) entry.id = entry.name + Math.random().toString(36).substr(2, 9);
        return entry;
    });
};

module.exports = { parseCSV };
