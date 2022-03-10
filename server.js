// Imports the required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

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
                break;

            case "Add a department":
                break;

            case "Add a role":
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
    const sql = `SELECT name, id FROM department`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.error(er);
        }
        else {
            console.table(rows);
            displayOptions(); 
        }
    });    
}

function viewAllRoles() {

}

// Exits the user prompts and ends the connection
function exit() {
    console.log("Thank you!");
    db.end();
}

