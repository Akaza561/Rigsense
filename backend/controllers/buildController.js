const Component = require('../models/Component');

const { spawn } = require('child_process');
const path = require('path');

const generateBuild = async (req, res) => {
    try {
        const { budget, useCase } = req.body;

        if (!budget || !useCase) {
            return res.status(400).json({ error: "Budget and Use Case are required." });
        }

        console.log(`[BUILD REQUEST] Budget: ₹${budget}, Use Case: ${useCase} -> Delegating to Python AI`);

        // Fetch all components
        const allParts = await Component.find({}).lean();

        if (allParts.length === 0) {
            return res.status(500).json({ error: "Database is empty. Please run seed script." });
        }

        // Prepare Data for Python
        const inputData = {
            request: { budget, useCase },
            database: allParts
        };

        // Determine Python Path (Check for Venv first)
        const isWindows = process.platform === 'win32';
        const venvPython = isWindows
            ? path.join(__dirname, '../../venv/Scripts/python.exe')
            : path.join(__dirname, '../../venv/bin/python');

        const pythonCommand = require('fs').existsSync(venvPython) ? venvPython : 'python';

        console.log(`[AI ENGINE] Using Python at: ${pythonCommand}`);

        // Spawn Python Process
        const pythonProcess = spawn(pythonCommand, [path.join(__dirname, '../ai/optimizer.py')]);

        let dataString = '';
        let errorString = '';

        // Send JSON to Python (stdin)
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

        // Listen for Result (stdout)
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        // Listen for Errors (stderr)
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        // Handle Completion
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python Logic Failed: ${errorString}`);
                return res.status(500).json({ error: "AI Engine Failed", details: errorString });
            }

            try {
                const result = JSON.parse(dataString);

                if (result.status === 'error') {
                    return res.status(500).json({ error: result.message });
                }

                console.log("[AI RESPONSE] Builds Generated Successfully.");

                // Transform Python Response to Frontend Schema
                // Python: { options: { strict_budget: {...}, ... }, reasoning: "..." }
                // Frontend Expects: { builds: [ { type: 'Strict Budget', parts: [...] }, ... ], reasoning: "..." }

                const formattedBuilds = [];
                const categoryMap = {
                    cpu: 'CPU',
                    gpu: 'GPU',
                    motherboard: 'Motherboard',
                    ram: 'RAM',
                    storage: 'Storage',
                    psu: 'PSU',
                    case: 'Case'
                };

                const strategyNames = {
                    'value': 'Value',
                    'performance': 'Performance',
                    'future_proof': 'Future Proof'
                };

                // Iterate over each strategy in the response
                for (const [strategyKey, buildData] of Object.entries(result.options)) {

                    const currentBuild = {
                        type: strategyNames[strategyKey] || strategyKey,
                        totalPrice: buildData.totalPrice || 0,
                        ai_score: buildData.ai_score || 0,
                        parts: []
                    };

                    // Convert parts object to array
                    for (const [key, partData] of Object.entries(buildData.parts)) {
                        if (partData && partData.name) {
                            currentBuild.parts.push({
                                category: categoryMap[key] || key.toUpperCase(),
                                ...partData
                            });
                        }
                    }

                    // Sort Parts
                    const sortOrder = ['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Case'];
                    currentBuild.parts.sort((a, b) => sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category));

                    formattedBuilds.push(currentBuild);
                }

                res.status(200).json({
                    builds: formattedBuilds,
                    reasoning: result.reasoning
                });

            } catch (e) {
                console.error("Failed to parse Python response:", dataString);
                res.status(500).json({ error: "Invalid AI Response" });
            }
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { generateBuild };
