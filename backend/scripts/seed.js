const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Component = require('../models/Component');
const { parseCSV } = require('../utils/csvParser');

dotenv.config({ path: path.join(__dirname, '../.env') });

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const csvPath = path.join(__dirname, '../data/components.csv');
        const csvText = fs.readFileSync(csvPath, 'utf-8');
        const components = parseCSV(csvText);

        console.log(`Parsed ${components.length} components from CSV.`);

        // Clear existing data
        await Component.deleteMany();
        console.log('Old data cleared.');

        // Insert new data
        await Component.insertMany(components);
        console.log('Data Imported Successfully!');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
