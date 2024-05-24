require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_PASS,
  password: process.env.DB_PORT,
});

const seedDatabase = async () => {
  try {
    await client.connect();
    const seedQuery = fs.readFileSync('seeds.sql', 'utf-8');
    await client.query(seedQuery);
    console.log('Database seeded successfully!');
  } catch (err) {
    console.errot('Errpr seeding the database:', err);
  } finally {
    await client.end();
  }
};

seedDatabase();
