const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
        });
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
        process.exit(1);
    }
};
// Importar los modelos.
require('../models/Vacantes')