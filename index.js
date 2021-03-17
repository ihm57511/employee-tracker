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
        name: 'firstName',
        type: 'input',
        message: "Please enter employee's first name."
      },
      {
        name: 'lastName',
        type: 'input',
        message: "Please enter employee's last name."
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
      {
        name: 'salary',
        type: 'input',
        message: "Please enter employee's salary."
      },

    ])
};

const viewInfo = () => {

};

const updateInfo = () => {

};

connection.connect((err) => {
  if (err) throw err;
  start();
});