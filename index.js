// Imports the required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const departments = [];
const roles = [];
const employees = [];

// Connects to the database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log("Connected to the company database")
);

displayOptions();

// Displays the options for user in console
function displayOptions() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["View all Departments", "View all Roles", "View all Employees",
                "Add a department", "Add a role", "Add an employee",
                "Update an employee role",
                "Exit"],
            name: "userOption"
        },
    ]).then(response => {
        switch (response.userOption) {
            case "View all Departments":
                viewAllDepartments();
                break;

            case "View all Roles":
                viewAllRoles();
                break;

            case "View all Employees":
                viewAllEmployees();
                break;

            case "Add a department":
                addDepartment();
                break;

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "Update an employee role":
                updateEmployeeRole();
                break;

            case "Exit":
                exit();
                break;
        }
    }).catch(error => console.log(error));
}

// Displays the formatted table containing the department name and ids
function viewAllDepartments() {
    const sql = `SELECT name, id FROM department;`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
        }
        else {
            console.table(rows);
            displayOptions();
        }
    });
}

// Displays the information like id, job title, department and salary of all roles
function viewAllRoles() {
    const sql = `SELECT role.id, title, department.name AS department, salary FROM role 
                LEFT JOIN department ON role.department_id = department.id;`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
        }
        else {
            console.table(rows);
            displayOptions();
        }
    });
}

// Displays all the employee data in a formatted table
function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, 
        role.salary, CONCAT(e.first_name," ", e.last_name) AS manager
        FROM employee LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee e ON employee.manager_id = e.id;`;

    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            console.table(data);
            displayOptions();
        }
    });
}

// Department entered by user is added to the database
function addDepartment() {
    inquirer.prompt([
        {
            message: "Enter the name of the department: ",
            type: "input",
            name: "departmentName",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                else {
                    return "Please enter the department name.";
                }
            }
        }
    ]).then(response => {
        const sql = `INSERT INTO department (name) VALUES (?);`;
        db.query(sql, response.departmentName, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`Department ${response.departmentName} added to database`);
                displayOptions();
            }
        });
    }).catch(err => console.log(err));
}

// Adds a role to the database which user has entered
function addRole() {
    // Gets the department names to display as options for the user
    getDepartmentOptions();

    // Prompts the user to enter the name, salary, and department for the role 
    inquirer.prompt([
        {
            message: "Enter the name of the role: ",
            type: "input",
            name: "title",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                else {
                    return "Please enter the name of the role you want to add";
                }
            }
        },
        {
            message: "What is the salary for this role?",
            type: "input",
            name: "salary",
            validate: answer => {
                const isNumber = answer.match(/^[1-9]\d*$/);
                if (isNumber) {
                    return true;
                }
                else {
                    return "Please enter only numbers for salary";
                }
            }
        },
        {
            message: "What department does the role belong to?",
            type: "list",
            choices: departments,
            name: "department"
        }
    ]).then(response => {
        // Gets the department id from the department name
        let sql = `SELECT id FROM department WHERE name = ?;`;
        db.query(sql, response.department, (err, id) => {
            if (err) {
                console.log(err);
            }
            else {
                const departmentId = id[0].id;
                // Inserts the role to database
                sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;
                db.query(sql, [response.title, response.salary, departmentId], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Added role '${response.title}' to the database.`);
                        displayOptions();
                    }
                });
            }
        })
    }).catch(err => console.log(err));
}

// Gets all the department names
function getDepartmentOptions() {
    const sql = `SELECT name FROM department;`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            for (i = 0; i < data.length; i++) {
                departments.push(data[i]);
            }
        }
    });
}

// Adds an employee to database
function addEmployee() {
    // Selects all role titles
    let sql = `SELECT id, title FROM role;`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < data.length; i++) {
                roles.push(data[i]);
            }

            // Selects all employee names
            sql = `SELECT id, first_name, last_name FROM employee;`;
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        employees.push(data[i]);
                    }

                    // Prompts the user to enter the first name, last name, role and manager of the employee to be added
                    inquirer.prompt([
                        {
                            message: "What is the employee's first name?",
                            type: "input",
                            name: "firstName",
                            validate: answer => {
                                if (answer !== "") {
                                    return true;
                                }
                                else {
                                    return "Please enter first name";
                                }
                            }
                        },
                        {
                            message: "What is the employee's last name?",
                            type: "input",
                            name: "lastName",
                            validate: answer => {
                                if (answer !== "") {
                                    return true;
                                }
                                else {
                                    return "Please enter last name";
                                }
                            }
                        },
                        {
                            message: "What is the employee's role?",
                            type: "list",
                            choices: roles.map(role => ({
                                name: role.title,
                                value: role.id
                            })),
                            name: "role"
                        },
                        {
                            message: "Who is the employee's manager",
                            type: "list",
                            choices: employees.map(manager => ({
                                name: manager.first_name + " " + manager.last_name,
                                value: manager.id
                            })),
                            name: "manager"
                        }
                    ]).then(response => {
                        // Adds the new employee to the database
                        sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                        db.query(sql, [response.firstName, response.lastName, response.role, response.manager], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(`Added the employee, ${response.firstName} ${response.lastName} to the database.`);
                                displayOptions();
                            }
                        });
                    }).catch(error => console.log(error));
                }
            });
        }
    });
}

function updateEmployeeRole() {
    // Selects all employee names
    let sql = `SELECT id, first_name, last_name FROM employee;`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < data.length; i++) {
                employees.push(data[i]);
            }

            // Selects all role titles
            let sql = `SELECT id, title FROM role;`;
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        roles.push(data[i]);
                    }

                    // Prompt to select the employee to update and their new role.
                    inquirer.prompt([
                        {
                            message: "Which employee do you want to update?",
                            type: "list",
                            choices: employees.map(employee => ({
                                name: employee.first_name + " " + employee.last_name,
                                value: employee.id
                            })),
                            name: "employee"
                        },
                        {
                            message: "Enter the new role of the employee.",
                            type: "list",
                            choices: roles.map(role => ({
                                name: role.title,
                                value: role.id
                            })),
                            name: "role"
                        }
                    ]).then(response => {
                        sql = `UPDATE employee SET role_id = ? WHERE id = ?;`;
                        db.query(sql, [response.role, response.employee], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(`Updated employee's role.`);
                                displayOptions();
                            }
                        })
                    })
                }
            });
        }
    });
}

// Exits the user prompts and ends the connection
function exit() {
    console.log("Thank you!");
    db.end();
}

