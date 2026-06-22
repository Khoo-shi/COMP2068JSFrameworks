const prompt = require('prompt');

prompt.start();

prompt.get(['userSelection'], function (err, result) {
    let userSelection = result.userSelection.toUpperCase();
    let randomNumber = Math.random();
let computerSelection = "";
if (randomNumber <= 0.34) {
    computerSelection = "PAPER";
}
else if (randomNumber <= 0.67) {
    computerSelection = "SCISSORS";
}
else {
    computerSelection = "ROCK";
}

    console.log("User: " + userSelection);
    console.log("Computer: " + computerSelection);   
    
    if (userSelection === computerSelection) {
    console.log("It's a tie");
}
    else if (
    (userSelection === "ROCK" && computerSelection === "SCISSORS") ||
    (userSelection === "PAPER" && computerSelection === "ROCK") ||
    (userSelection === "SCISSORS" && computerSelection === "PAPER")
) {
    console.log("User Wins");
}
    else if (
    (userSelection === "ROCK" && computerSelection === "PAPER") ||
    (userSelection === "PAPER" && computerSelection === "SCISSORS") ||
    (userSelection === "SCISSORS" && computerSelection === "ROCK")
) {
    console.log("Computer Wins");
}
else {
    console.log("Invalid input. Please enter ROCK, PAPER, or SCISSORS.");
}

});
