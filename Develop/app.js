const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = []

//Menu is created
function menu() {

  //Generate Manager Questions
  function managerQuestions() {
    inquirer.prompt([
      {
        type: "input",
        message: "What is the manager's name?",
        name: "managerName",
        validate: answer => {
          if (!answer) {
            return "Please enter a name"
          }
          return true
        }
      },
      {
        type: "input",
        message: "What is the manager's ID?",
        name: "managerID"
      },
      {
        type: "input",
        message: "What is the manager's Email?",
        name: "managerEmail"
      },
      {
        type: "input",
        message: "What is the manager's Office Number?",
        name: "managerOfficeNo"
      }]).then(response => {
        const manager = new Manager(response.managerName, response.managerID, response.managerEmail, response.managerOfficeNo)
        employees.push(manager)
        newTeamSwitch()})
    }

  //After entering each member, will go back to switch
  function newTeamSwitch() {
    inquirer.prompt([
      {
        type: "list",
        message: "What type of team member do you want to add?",
        name: "teamMemberType",
        choices: ["Intern", "Engineer", "Done"]
      }]).then(response => {
        var newTeamMember = response.teamMemberType
        switch (newTeamMember) {
          case "Engineer": engineerQuestions(newTeamMember)
            break;
          case "Intern": internQuestions(newTeamMember)
            break;
          default: compileTeam()
        }
      })
  }

  //questions if Engineer is chosen
  function engineerQuestions(newTeamMember) {
    inquirer.prompt([
      {
        type: "input",
        message: `What is the ${newTeamMember}'s name?`,
        name: "engineerName"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s ID?`,
        name: "engineerID"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s Email?`,
        name: "engineerEmail"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s Github Username?`,
        name: "engineerUsername",
      }]).then(response => {
        const engineer = new Engineer(response.engineerName, response.engineerID, response.engineerEmail, response.engineerUsername)
        employees.push(engineer)
        newTeamSwitch()
      })
  }

  //Questions if Intern is chosen
  function internQuestions(newTeamMember) {
    inquirer.prompt([
      {
        type: "input",
        message: `What is the ${newTeamMember}'s name?`,
        name: "internName"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s ID?`,
        name: "internID"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s Email?`,
        name: "internEmail"
      },
      {
        type: "input",
        message: `What is the ${newTeamMember}'s school?`,
        name: "internSchool",
      }]).then(response => {
        const intern = new Intern(response.internName, response.internID, response.internEmail, response.internSchool)
        employees.push(intern)
        newTeamSwitch()
      })
  }

  //When done adding employees
  function compileTeam() {
    const html = render(employees)
    fs.writeFile("./output/team.html", html, function(err){
      if (err) console.log(err)
    })
  }

  //Start function with Manager questions
  managerQuestions()
}

//Run on page load
menu()
