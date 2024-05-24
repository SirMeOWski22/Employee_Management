require('dotenv').config();
const { Client } = require('pg');
const inquirer = require('inquirer');
const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
} = require('./queries');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'View Employees by Manager',
          'View Employees by Department',
          'Add a Department',
          'Add a Role',
          'Add an Employee',
          'Update Employee Role',
          'Quit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View All Departments':
          viewDepartments(client, mainMenu);
          break;
        case 'View All Roles':
          viewRoles(client, mainMenu);
          break;
        case 'View All Employees':
          viewEmployees(client, mainMenu);
          break;
        case 'View Employees by Manager':
          viewEmployeesByManager(client, mainMenu);
          break;
        case 'View Employees by Department':
          viewEmployeesByDepartment(client, mainMenu);
          break;
        case 'Add a Department':
          addDepartment(client, mainMenu);
          break;
        case 'Add a Role':
          addRole(client, mainMenu);
          break;
        case 'Add an Employee':
          addEmployee(client, mainMenu);
          break;
        case 'Update Employee Role':
          updateEmployeeRole(client, mainMenu);
          break;
        case 'Quit':
          console.log('Goodbye!');
          client.end();
          break;
      }
    });
};

client
  .connect()
  .then(() => {
    console.log('Connected to the database');
    mainMenu();
  })
  .catch((err) => console.error('Error connecting to the database', err));
