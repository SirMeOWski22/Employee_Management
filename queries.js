const inquirer = require('inquirer');

const viewDepartments = async (client, callback) => {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
  callback();
};

const viewRoles = async (client, callback) => {
  const res = await client.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(res.rows);
  callback();
};

const viewEmployees = async (client, callback) => {
  const res = await client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `);
  console.table(res.rows);
  callback();
};

const addDepartment = async (client, callback) => {
  const { name } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter department name:',
  });

  // Check if the department already exists
  const existingDepartment = await client.query('SELECT id FROM department WHERE name = $1', [
    name,
  ]);

  if (existingDepartment.rows.length === 0) {
    // Department does not exist, insert a new record
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
  } else {
    console.log(`Department '${name}' already exists. Skipping insertion.`);
  }

  callback();
};

const addRole = async (client, callback) => {
  const { title, salary, department_id } = await inquirer.prompt([
    { name: 'title', type: 'input', message: 'Enter role title:' },
    { name: 'salary', type: 'input', message: 'Enter role salary:' },
    { name: 'department_id', type: 'input', message: 'Enter department ID:' },
  ]);

  // Check if the role already exists
  const existingRole = await client.query('SELECT id FROM role WHERE title = $1', [title]);

  if (existingRole.rows.length === 0) {
    // Role does not exist, insert a new record
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
      title,
      salary,
      department_id,
    ]);
    console.log(`Added role: ${title}`);
  } else {
    console.log(`Role '${title}' already exists. Skipping insertion.`);
  }

  callback();
};

const addEmployee = async (client, callback) => {
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { name: 'first_name', type: 'input', message: 'Enter employee first name:' },
    { name: 'last_name', type: 'input', message: 'Enter employee last name:' },
    { name: 'role_id', type: 'input', message: 'Enter role ID:' },
    { name: 'manager_id', type: 'input', message: 'Enter manager ID (if any):', default: null },
  ]);

  // Check if the employee already exists
  const existingEmployee = await client.query(
    'SELECT id FROM employee WHERE first_name = $1 AND last_name = $2',
    [first_name, last_name]
  );

  if (existingEmployee.rows.length === 0) {
    // Employee does not exist, insert a new record
    await client.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
    console.log(`Added employee: ${first_name} ${last_name}`);
  } else {
    console.log(`Employee '${first_name} ${last_name}' already exists. Skipping insertion.`);
  }

  callback();
};

const updateEmployeeRole = async (client, callback) => {
  const { employee_id, new_role_id } = await inquirer.prompt([
    { name: 'employee_id', type: 'input', message: 'Enter employee ID to update:' },
    { name: 'new_role_id', type: 'input', message: 'Enter new role ID:' },
  ]);
  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
  console.log(`Updated employee ID ${employee_id} with new role ID ${new_role_id}`);
  callback();
};

const viewEmployeesByManager = async (client, callback) => {
  const res = await client.query(`
    SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY manager
  `);
  console.table(res.rows);
  callback();
};

const viewEmployeesByDepartment = async (client, callback) => {
  const res = await client.query(`
    SELECT department.name AS department, employee.id, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY department
  `);
  console.table(res.rows);
  callback();
};

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
};
