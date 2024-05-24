require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const seedDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const sql = fs.readFileSync(path.join(__dirname, 'seeds.sql')).toString();
    console.log('Executing the following SQL:');
    console.log(sql);

    await client.query(sql);
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding the database', err);
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

seedDatabase();
