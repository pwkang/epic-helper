import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = mongoose.createConnection(uri, {
  connectTimeoutMS: 10000,
});

export const mongoClient = client.useDb('epic-helper');
mongoClient.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoClient.on('error', (err) => {
  console.error(err);
});

mongoClient.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

mongoClient.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});
