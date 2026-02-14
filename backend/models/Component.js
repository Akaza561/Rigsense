const mongoose = require('mongoose');

const componentSchema = mongoose.Schema({
    part: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    performance_score: { type: Number, required: true },
    description: String,
    purpose: [String],

    // Technical Specs (Optional based on part type)
    socket: String,
    ram_type: String, // e.g., DDR4, DDR5
    watt: Number,
    vram: Number,
    capacity: Number,

}, {
    timestamps: true,
});

const Component = mongoose.model('Component', componentSchema);

module.exports = Component;
