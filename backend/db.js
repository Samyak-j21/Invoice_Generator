const { MongoClient } = require('mongodb');
require('dotenv').config();

let uri = process.env.MONGO_URI;
if (!uri) {
  console.error("CRITICAL: MONGO_URI environment variable is missing!");
  process.exit(1);
}

// Sanitize: trim whitespace and remove any trailing semicolon that causes parsing errors
uri = uri.trim().replace(/;$/, '');

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
