const { MongoClient } = require('mongodb');
require('dotenv').config();

let uri = process.env.MONGO_URI;
if (!uri) {
  console.error("CRITICAL: MONGO_URI environment variable is missing!");
  process.exit(1);
}

// Aggressive Sanitization: strip leading/trailing quotes, spaces, and semicolons
uri = uri.trim()
         .replace(/^["']|["']$/g, '') // remove leading/trailing quotes
         .replace(/;$/, '')           // remove trailing semicolon
         .trim();                     // final trim spaces

// Safe logger to inspect prefix without exposing credentials
const maskedStart = uri.substring(0, 15);
console.log(`Initializing MongoClient. URI starts with: "${maskedStart}...", Total Length: ${uri.length}`);

if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  console.error(`WARNING: Connection string prefix is invalid! Starts with: "${uri.substring(0, 20)}"`);
}

const client = new MongoClient(uri);

let dbConnection = null;

async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  
  try {
    await client.connect();
    console.log('Connected to MongoDB via native driver successfully!');
    // Extract database name from connection string if present, or use default 'invoice_generator'
    dbConnection = client.db('invoice_generator');
    return dbConnection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

function getDb() {
  if (!dbConnection) {
    throw new Error('Database not initialized. Please call connectToDatabase first.');
  }
  return dbConnection;
}

module.exports = {
  connectToDatabase,
  getDb
};
