//Import modules
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

//PostgresSQL client connection details
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

//Function to seed the database
const seedDatabase = async () => {
  try {
    //Connect to PostgresSQL
    await client.connect();
    console.log('Connected to the database');
    //Read the seeds.sql file
    const sql = fs.readFileSync(path.join(__dirname, 'seeds.sql')).toString();
    console.log('Executing the following SQL:');
    console.log(sql);

    //Execute the SQL commands to seed database
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
