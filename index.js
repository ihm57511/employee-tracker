const inquirer = require('inquirer');
const mysql = require('mysql');
const ct = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeTracker_DB',
});

const start = () => {
  inquirer
    .prompt({
      name: 'mainMenu',
      type: 'list',
      message: 'Welcome, what would you like to do?',
      choices: [
        { name: 'ADD INFO', value: addInfo },
        { name: 'VIEW INFO', value: viewInfo },
        { name: 'UPDATE INFO', value: updateInfo },
        { name: 'EXIT', value: connection.end },
      ]
    })
};

const addInfo = () => {
  inquirer
    .prompt([
      {
        name: 'addMenu',
        type: 'list',
        message: 'Would you like to add an employee, department, or manager?',
        choices: [
          { name: 'EMPLOYEE', value: addEmployee },
          { name: 'MANAGER', value: addManager },
          { name: 'DEPARTMENT', value: addDepartment },
          { name: 'MAIN MENU', value: start},
        ]
      }
    ])
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name
      }
    ])
}

const viewInfo = () => {

};

const updateInfo = () => {

};

connection.connect((err) => {
  if (err) throw err;
  start();
});