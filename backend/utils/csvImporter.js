require('dotenv').config();
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');
const Show = require('../models/Show');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const parseDate = (dateString) => {
    if (!dateString || dateString.trim() === '') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

const splitAndClean = (str) => {
    if (!str || str.trim() === '') return [];
    return str.split(',').map(item => item.trim()).filter(item => item);
};

const importCSV = async (filePath) => {
    try {
        await connectDB();

        const csvFilePath = filePath || '../data/netflix_titles.csv';
        console.log(`Importing data from: ${csvFilePath}`);

        const records = [];
        const parser = fs
            .createReadStream(csvFilePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            }));

        for await (const record of parser) {
            const show = {
                show_id: record.show_id,
                type: record.type,
                title: record.title,
                director: record.director || '',
                cast: splitAndClean(record.cast),
                country: record.country || '',
                date_added: parseDate(record.date_added),
                release_year: parseInt(record.release_year) || null,
                rating: record.rating || '',
                duration: record.duration || '',
                listed_in: splitAndClean(record.listed_in),
                description: record.description || ''
            };

            records.push(show);
        }

        console.log(`Parsed ${records.length} records from CSV`);

        let imported = 0;
        let updated = 0;

        for (const record of records) {
            const existing = await Show.findOne({ show_id: record.show_id });

            if (existing) {
                await Show.updateOne({ show_id: record.show_id }, record);
                updated++;
            } else {
                await Show.create(record);
                imported++;
            }

            if ((imported + updated) % 100 === 0) {
                console.log(`Processed ${imported + updated} shows...`);
            }
        }

        console.log('\n=== Import Summary ===');
        console.log(`Total records in CSV: ${records.length}`);
        console.log(`New shows imported: ${imported}`);
        console.log(`Existing shows updated: ${updated}`);
        console.log(`Total in database: ${await Show.countDocuments()}`);

        await mongoose.connection.close();
        console.log('\nImport completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Import error:', error);
        process.exit(1);
    }
};

const filePath = process.argv[2];
importCSV(filePath);