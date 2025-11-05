const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    show_id: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Movie', 'TV Show'],
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    director: String,
    cast: [String],
    country: String,
    date_added: Date,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: [String],
    description: String
});

showSchema.index({ title: 'text', cast: 'text' });

module.exports = mongoose.model('Show', showSchema);