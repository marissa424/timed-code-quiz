//select each card div by their id and assign to variables 
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

var intervalID;
var time;
var currentQuestion;

//hide all cards
function hideCards() {
    startCard.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

//hide result dive
function hideResultText() {
    resultDiv.style.display = "none";
}

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
    hideCards();
    questionCard.removeAttribute("hidden");
    currentQuestion = 0;
    displayQuestion();
    time = questions.length * 10;
    intervalID = setInterval(countdown, 1000);
    displayTime();
}

// if time runs out end quiz
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

// Display time on quiz
const timeDisplay = document.querySelector("#time");
function displayTime() {
    timeDisplay.textContent = time;
}

//Show question and answers 
function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;

    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}

// Store questions and answers 
const questions = [
    {
        questionText: "Commonly used data types DO NOT include:",
        options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
        answer: "3. alerts",
    },
    {
        questionText: "Arrays in JavaScript can be used to store ______.",
        options: ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of the above"],
        answer: "4. all of the above",
    },
    {
        questionText:
            "String values must be enclosed within _____ when being assigned to variables.",
        options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
        answer: "3. quotes",
    },
    {
        questionText:
            "A very useful tool used during development and debugging for printing content to the debugger is:",
        options: ["1. JavaScript", "2. terminal/bash", "3. for loops", "4. console.log",],
        answer: "4. console.log",
    },
    {
        questionText:
            "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
        options: ["1. break", "2. stop", "3. halt", "4. exit"],
        answer: "1. break",
    },
];

//behavior when an answer button is clicked
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//Compare the text content of the option button with the answer to the current question 
function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}

//If answer is not correct take 10seconds off time
function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
        resultText.textContent = "Correct!";
        setTimeout(hideResultText, 1000);
    } else {
        resultText.textContent = "Incorrect!";
        setTimeout(hideResultText, 1000);
        if (time >= 10) {
            time = time - 10;
            displayTime();
        } else {
            time = 0;
            displayTime();
            endQuiz();
        }
    }

    //incremnt current question by 1
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

//display scorecard and hide other divs
const score = document.querySelector("#score");

//end of quiz clear timer and hide visable cards and show scorecard with scores
function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

//Store user initials and scroe when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
    event.preventDefault();
    if (!inputElement.value) {
        alert("Please enter your initials");
        return;
    }

    let leaderboardItem = {
        initials: inputElement.value,
        score: time,
    };

    updateStoredLeaderboard(leaderboardItem);

    hideCards();
    leaderboardCard.removeAttribute("hidden");

    renderLeaderboard();
}

function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    //append new leaderboard item to leaderboard array
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//Get leaderboardArray from local storage if it exists 
function getLeaderboard() {
    let storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
        let leaderboardArray = JSON.parse(storedLeaderboard);
        return leaderboardArray;
    } else {
        leaderboardArray = [];
    }
    return leaderboardArray;
}

//Show leaderboard on highScore card
function renderLeaderboard() {
    let sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
        let leaderboardEntry = sortedLeaderboardArray[i];
        let newListItem = document.createElement("li");
        newListItem.textContent =
            leaderboardEntry.initials + " - " + leaderboardEntry.score;
        highscoreList.append(newListItem);
    }
}

//sort leaderboard from higest to lowest
function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
        return;
    }

    leaderboardArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//Clear local stored and empty leaderboard
function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

//Hide leaderboard and show start card
function returnToStart() {
    hideCards();
    startCard.removeAttribute("hidden");
}

//use highscore line to view highscores at any point
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
    hideCards();
    leaderboardCard.removeAttribute("hidden");

    clearInterval(intervalID);

    time = undefined;
    displayTime();

    renderLeaderboard();
}
