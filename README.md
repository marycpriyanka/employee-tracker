# Employee Tracker
![badge](https://img.shields.io/badge/MIT-License-blue.svg)

## Description

Employee tracker is a command line application to manage a company's employee database, using Node.js, Inquirer and MySQL. This application is very useful for business owners to view and manage the departments, roles, and employees in their company so that they can organize and plan their business.

## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies used](#technologies-used)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Questions](#questions)

## Installation

- Use 'npm i' in your command line to install all dependent packages. 
- Add a .env file in your root directory. It should contain 3 environment variables named DB_USER, DB_PASSWORD and DB_NAME. Assign the variables with values of your database username, database password, and database table name which is 'company_db'. 
- Go to mysql command line using  'mysql -u root -p'. Do 'SOURCE db/schema.sql' and 'SOURCE db/seeds.sql

## Usage

Invoke the application by typing 'node index' in the command line. When the application is started, user will be presented with a list of options like View all departments, View all roles, View all Employees, Add a department, Add a role, Add an employee, Update an employee role, and Exit. 

![Options](https://github.com/marycpriyanka/employee-tracker/blob/main/screenshots/screenshot1.JPG)

Choose the option needed and answer any questions. 

![screenshot2](https://github.com/marycpriyanka/employee-tracker/blob/main/screenshots/screenshot2.JPG)

User can exit the application by selecting the option 'Exit'. 

![exit](https://github.com/marycpriyanka/employee-tracker/blob/main/screenshots/screenshot3.JPG)

Find a walkthrough video that demonstrates the functionality of the employee tracker in the link below.

https://drive.google.com/file/d/1YxBnjuooYGymz1-02sBM2fmAt5gMaAQq/view?usp=sharing

## Features

- If 'View all Departments' is selected, the user is presented with a formatted table showing department names and department ids.
- If 'View all Roles' is selected, then user is presented with the job title, role id, the department the role belongs to, and the salary for that role.
- If 'View all Employees' is selected, the user is presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and the managers the employees report to.
- If 'Add a department' is selected, user is prompted to enter the name of the department and that department is added to the database.
- If 'Add a role' is selected, user is prompted to enter the name, salary and department for the role and that role is added to the database.
- If 'Add an employee' is selected, user is prompted to enter the employee's first name, last name, role, and manager, and that employee is added to the database.
- If 'Update an employee role' is selected, user is prompted to select an employee to update and their new role and this information is updated in the database.
- All user input is validated. 

##  Technologies used

Node.js, Inquirer package, MySQL2 package, console.table package and .env package

## License

Employee Tracker is available under the MIT License.

## How to Contribute

Contributions and ideas are welcome. Before submitting an issue, please take a moment to look over the contributing guidelines in https://www.contributor-covenant.org/ . Before submitting pull requests, ensure the following:

- Fork the repo and create your branch from master.
- Test your code.

## Questions

https://github.com/marycpriyanka

For any addditional questions, reach me at marycpriyanka@gmail.com.
