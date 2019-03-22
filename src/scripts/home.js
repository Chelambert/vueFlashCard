const debug = true;

const BASEURL = "https://sampleapis.com/futurama/questions";
let game = {
    name: "",
    correct: 0,
    total: 0,
    currentQuestion: 0,
};

// cache your DOM
let startBtn;
let submitBtn;
let retakeBtn;
let closeBtn;
let questionDisplay;
let answersDisplay;
let questionsContainer;
let homeContainer;
let scoreContainer;
let questionsArr;
let correctAnswerDisplay;
let incorrectAnswerDisplay;
let flash;
let scoreMessage;
let score;

function getQuestions() {
    fetch(BASEURL)
        .then(resp => resp.json())
        .then(json => {
            // we are randomizing array
            questionsArr = randomizeArray(json);
            questionsArr = trimArray(questionsArr, 8);
            // turning on event listener to start quiz
            startBtn.addEventListener("click", startQuiz);
        })
}

/**
 * randomizeArray
 *
 * @param {array} arr
 * @return {array} randomizedArray
 */
function randomizeArray(_arr) {
    return _arr.sort(() => Math.random() > .5 ? -1 : 1)
}

function trimArray(_arr, _min) {
    const max = _arr.length - 1;
    const min = _min;
    const total = Math.floor(Math.random() * (max - min + 1) + min);

    return _arr.filter((a, i) => i < total);
}

/**
 * cacheDOM
 *
 * This simply selects all the dom elements we care about in this app
 */
function cacheDOM() {
    if (debug) console.log('caching dom');
    startBtn = document.querySelector("#btn__start");
    submitBtn = document.querySelector("#btn__submit");
    retakeBtn = document.querySelector("#btn__retake");
    closeBtn = document.querySelector("#btn__close");
    questionDisplay = document.querySelector('.question__header');
    answersDisplay = document.querySelector('.answers');
    incorrectAnswerDisplay = document.querySelector('.flash__incorrect');
    correctAnswerDisplay = document.querySelector('.flash__correct');
    homeContainer = document.querySelector(".container.home");
    questionsContainer = document.querySelector(".container.questions");
    scoreContainer = document.querySelector(".container.score");
    scoreMessage = document.querySelector(".score-message");
    score = document.querySelector(".score");
}

/**
 * setEventListeners
 *
 * after selecting the dom elements, listen for events we might need in the app
 */
function setEventListeners() {
    submitBtn.addEventListener("click", checkAnswer);
    retakeBtn.addEventListener("click", startQuiz);

}

/**
 * startQuiz
 *
 * kicking things off with first question
 */
function startQuiz(e) {
    scoreContainer.classList.add('hide');

    e.preventDefault();
    if (debug) console.log('starting quiz');

    // toggle what items are displayed
    homeContainer.classList.add('hide');
    questionsContainer.classList.remove('hide');

    // reset game incase of restart

    game = {
        name: "",
        correct: 0,
        total: 0,
        currentQuestion: 0,
    };

    // display first question
    displayCurrentQuestion();

    // display first set of answers
    displayCurrentPossibleAnswers();
}


function displayCurrentQuestion() {
    console.log('display current question')
    questionDisplay.innerText = questionsArr[game.currentQuestion].question
}

function displayCurrentPossibleAnswers() {
    //TODO: how to clear to refresh answers
    console.log('display current answers')
    const randomizeAnswers = randomizeArray(questionsArr[game.currentQuestion].possibleAnswers)
    answersDisplay.innerHTML = randomizeAnswers.map(a => {
        return `<li>
            <label>
                <span>${a}</span>
                <input type="radio" name="posAnswer" value="${a}"/>
            </label>
        </li>`;
    }).join('');
}

function checkAnswer() {
    // check answers after submit button is clicked
    // const userAnswer = document.querySelector('[name="posAnswer"]:checked');
    const userAnswer = document.querySelector('[name="posAnswer"]:checked').value;
    console.log(userAnswer);
    if (userAnswer == questionsArr[game.currentQuestion].correctAnswer) {
        correctAnswerDisplay.classList.remove('hide');
        questionsContainer.classList.add('hide');
        ++game.correct
    }

    else {
        incorrectAnswerDisplay.classList.remove('hide');
        questionsContainer.classList.add('hide');
        incorrectAnswerDisplay.innerHTML = `<h2>Wrong!!! The correct answer is: ${questionsArr[game.currentQuestion].correctAnswer}</h2>`
    }
    console.log(game);
    ++game.currentQuestion;


    flashTimer();

    displayCurrentQuestion();
    displayCurrentPossibleAnswers();
}

function flashTimer() {
    //start timer
    //update display to next question
    flash = setInterval(displayNewQuestion, 2000);
}

function displayNewQuestion() {
    //next question function
    //clear timer (set interval and clear interval)
    //trigger two other functions
    console.log("displayed new function");
    correctAnswerDisplay.classList.add('hide');
    incorrectAnswerDisplay.classList.add('hide');
    questionsContainer.classList.remove('hide');

    clearInterval(flash);
    quizEnd();
}

function quizEnd() {
    if (game.currentQuestion > 9) {
        console.log("you're done");
        scoreContainer.classList.remove('hide');
        questionsContainer.classList.add('hide');

        scoreCheck();
    }
}

function scoreCheck() {
    //TODO: make sure retake button comes up and is clickable
    const passed = game.correct < 6
    const endMessage = passed ? 'You failed!!' : 'You passed!!';
    scoreContainer.querySelector('.score-message').innerText = `Your final score is: ${game.correct}/10`
    scoreContainer.querySelector('.score').innerText = endMessage;
}

function init() {
    cacheDOM();
    setEventListeners();
    getQuestions();
}

init();

