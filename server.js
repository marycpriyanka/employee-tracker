// Imports the required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const departments = [];

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
                break;

            case "Update an employee role":
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

//
function addRole() {
    getDepartmentOptions();

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
                if (answer !== "") {
                    return true;
                }
                else {
                    return "Please enter the salary."
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

    }).catch(err => console.log(err));
}

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
    })
}

// Exits the user prompts and ends the connection
function exit() {
    console.log("Thank you!");
    db.end();
}

