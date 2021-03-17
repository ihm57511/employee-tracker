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
          { name: 'ROLE', value: addRole },
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
        name: 'firstName',
        type: 'input',
        message: "Please enter employee's first name."
      },
      {
        name: 'lastName',
        type: 'input',
        message: "Please enter employee's last name.",
      },
      {
        name: 'roleId',
        type: 'list',
        message: "Please choose this employee's role.",
        choices: [

        ],
      },
      {
        name: 'managerId',
        type: 'list',
        message: "Please choose this employee's manager.",
        choices: [

        ],
      },
    ])
}

const addRole = () => {
  inquirer
    .prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: "Please enter title of new role."
      },
      {
        name: 'salary',
        type: 'input',
        message: "Please enter salary amount for new role."
      },
      {
        name: 'roleDept',
        type: 'list',
        message: "Please select the parent department for new role.",
        choices: [

        ]
      }
    ])
}

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'deptartmentTitle',
        type: 'input',
        message: "Please enter title of new department",
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