const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

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
        'Add Info',
        'View Info',
        'Update Info',
        'EXIT',
      ],
    })
    .then((answer) => {
      switch (answer.mainMenu) {
        case 'Add Info':
          addInfo();
          break;

        case 'View Info':
          viewInfo();
          break;

        case 'Update Info':
          updateInfo();
          break;

        case 'EXIT':
          connection.end();
          break;
      }
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
          'Employee',
          'Role',
          'Department',
          'MAIN MENU',
        ],
      }
    ])
    .then((answer) => {
      switch (answer.addMenu) {
        case 'Employee':
          addEmployee();
          break;

        case 'Role':
          addRole();
          break;

        case 'Department':
          addDepartment();
          break;

        case 'MAIN MENU':
          start();
          break;
      }
    })
};

const addEmployee = () => {
  connection.query(`SELECT * FROM role`, (err, position) => {
    if (err) throw err;
    connection.query(`SELECT * FROM employee`, (err, reportsTo) => {
      if (err) throw err;
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
            choices: () => position.map((role) => {
              return { name: role.title, value: role.id }
            }),
            message: "Please choose this employee's role.",
          },
          {
            name: 'managerId',
            type: 'list',
            choices: () => reportsTo.map((manager) => {
              return { name: `${manager.first_name} ${manager.last_name}`, value: manager.id }
            }),
            message: "Please choose this employee's manager.",
          }
        ])
        .then((newEmployee) => {
          connection.query(`INSERT INTO employee SET ?`, {
            first_name: newEmployee.firstName,
            last_name: newEmployee.lastName,
            role_id: newEmployee.roleId,
            manager_id: newEmployee.managerId,
          })
          setTimeout(somethingElse, 2000);
        })
    })
  })

};

const addRole = () => {
  connection.query(`SELECT department.name, department.id FROM department`, (err, departmentList) => {
    if (err) throw err;
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
          choices: () => departmentList.map((department) => {
            return { name: department.name, value: department.id }
          }),
          message: "Please select the parent department for new role.",
        }
      ])
      .then((newRole) => {
        connection.query(`INSERT INTO role SET ?`, {
          title: newRole.roleTitle,
          salary: newRole.salary,
          department_id: newRole.roleDept,
        })
        setTimeout(somethingElse, 2000);
      })
  })
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'deptartmentTitle',
        type: 'input',
        message: "Please enter title of new department",
      }
    ])
    .then((newDept) => {
      connection.query(`INSERT INTO department SET ?`, {
        name: newDept.deptartmentTitle,
      })
      setTimeout(somethingElse, 2000);
    })
};

const viewInfo = () => {
  inquirer
    .prompt({
      name: 'viewMenu',
      type: 'list',
      message: 'Which info would you like to view?',
      choices: [
        'Employees',
        'Roles',
        'Departments',
        'MAIN MENU',
      ],
    })
    .then((answer) => {
      switch (answer.viewMenu) {
        case 'Employees':
          viewEmployees();
          break;

        case 'Roles':
          viewRoles();
          break;

        case 'Departments':
          viewDepartments();
          break;

        case 'MAIN MENU':
          start();
          break;
      }
    })
};

const viewEmployees = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
   AS department, role.salary 
   FROM employee
   LEFT JOIN role on employee.role_id = role.id
   LEFT JOIN department on role.department_id = department.id
   `, (err, employees) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'viewEmployeeMenu',
          type: 'list',
          message: "Would you like to view all employee's, or select from list?",
          choices: [
            'View All',
            'Select From List',
          ]
        },
      ])
      .then((answer) => {
        switch (answer.viewEmployeeMenu) {
          case 'View All':
            console.table(employees);
            setTimeout(somethingElse, 2000);
            break;
          case 'Select From List':
            viewEmployeesByList();
            break;
        }
      })
  })
};

const viewEmployeesByList = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
   AS department, role.salary 
   FROM employee
   LEFT JOIN role on employee.role_id = role.id
   LEFT JOIN department on role.department_id = department.id
   `, (err, employees) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'employeeList',
          type: 'list',
          choices: () => employees.map((name) => {
            return { name: `${name.first_name} ${name.last_name}`, value: name.id }
          }),
          message: "Which employee would you like to view?"
        }
      ])
      .then((selectedEmployee) => {
        connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
        AS department, role.salary 
        FROM employee 
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id 
        WHERE employee.id = ${selectedEmployee.employeeList}`,
          (err, row) => {
            if (err) throw err;
            console.table(row)
          })
        setTimeout(somethingElse, 2000);

      })
  })
};

const viewRoles = () => {
  connection.query(
    `SELECT role.id, title, salary, department.name, employee.first_name, employee.last_name 
  FROM role
  LEFT JOIN department on role.department_id = department.id
  LEFT JOIN employee on role.id = employee.role_id;
  `, (err, roles) => {
    if (err) throw err;
    console.table(roles);
  })
  setTimeout(somethingElse, 2000);

};

const viewDepartments = () => {
  connection.query(
    `SELECT department.id, department.name, role.title, role.salary, employee.first_name, employee.last_name
  FROM department
  LEFT JOIN role on department.id = role.department_id
  LEFT JOIN employee on role.id = employee.role_id;
  `, (err, departments) => {
    if (err) throw err;
    console.table(departments)
  })
  setTimeout(somethingElse, 2000)
};

const updateInfo = () => {
  connection.query(`SELECT * FROM employee
   `, (err, employees) => {
    if (err) throw err;
    connection.query(`SELECT * FROM role`, (err, titleList) => {
      if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'employeeList',
          type: 'list',
          choices: () => employees.map((name) => {
            return { name: `${name.first_name} ${name.last_name}`, value: name.id }
          }),
          message: "Which employee would you like to update?"
        },
        {
          name: 'roleId',
          type: 'list',
          choices: () => titleList.map((role) => {
            return { name: `${role.title}`, value: role.id }
          }),
          message: "Please choose this employee's updated role.",
        },
      ])
      .then((selectedEmployee) => {
        connection.query(
          `UPDATE employee SET ? WHERE ?`,
          [
            {
              role_id: selectedEmployee.roleId,
            },
            {
              id: selectedEmployee.employeeList,
            },
          ]
        )
        setTimeout(somethingElse, 2000)
      })
    })       
  })
};

const somethingElse = () => {
  inquirer
    .prompt([
      {
        name: 'addMenu',
        type: 'list',
        message: 'Would you like to something else?',
        choices: [
          'Yes',
          'No',
        ],
      }
    ])
    .then((answer) => {
      switch (answer.addMenu) {
        case 'Yes':
          start();
          break;

        case 'No':
          connection.end();
          break;
      }
    })
};

connection.connect((err) => {
  if (err) throw err;
  start();
});