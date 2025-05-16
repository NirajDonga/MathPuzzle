// Get DOM elements
const val1Element = document.getElementById('val1');
const operatorElement = document.getElementById('op');
const val2Element = document.getElementById('val2');
const answerInput = document.getElementById('ans');
const scoreValueElement = document.getElementById('score-value');
const timerValueElement = document.getElementById('timer-value');
const startButton = document.getElementById('start-btn');
const resultMessage = document.getElementById('result-message');

// Game variables
let currentLevel = 1;
let currentScore = 0;
let timeLeft = 60;
let timerInterval;
let currentQuestion;
let isGameActive = false;
let previousQuestions = new Set(); 
const MAX_TRACKED_QUESTIONS = 69;
const MAX_LEVEL = 5;

// Event listeners
startButton.addEventListener('click', startGame);
answerInput.addEventListener('input', checkAnswerAsTyped);

// Start the game
function startGame() {
    currentLevel = 1;
    currentScore = 0;
    timeLeft = 60;
    isGameActive = true;
    previousQuestions.clear();
    
    // Reset timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) endGame();
    }, 1000);
    
    // Enable answer input
    answerInput.disabled = false;
    answerInput.value = '';
    answerInput.focus();
    startButton.style.display = 'none';
    resultMessage.textContent = '';
    
    setNextQuestion();
    updateDisplay();
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    answerInput.disabled = true;
    startButton.style.display = 'inline-block';
    startButton.textContent = 'Play Again';
    resultMessage.textContent = `Game Over! Final Score: ${currentScore}`;
    resultMessage.style.color = '#ffcc00';
}

// Check the user's answer as they type
function checkAnswerAsTyped() {
    if (!isGameActive) return;
    
    const userAnswer = parseInt(answerInput.value.trim());
    
    if (isNaN(userAnswer) || answerInput.value.trim() === '') return;
    
    if (userAnswer === currentQuestion.answer) {
        // Correct answer
        currentScore++;
        resultMessage.textContent = 'Correct!';
        resultMessage.style.color = '#4dff4d';
        
        // Level up if needed
        if (currentScore >= currentLevel * 5 && currentLevel < MAX_LEVEL) {
            currentLevel++;
        }
        
        // Set next question
        setTimeout(() => {
            setNextQuestion();
            answerInput.value = '';
            answerInput.focus();
            resultMessage.textContent = '';
        }, 100);
    } else {
        // Wrong answer
        resultMessage.textContent = 'Try again!';
        resultMessage.style.color = '#ff6666';
    }
    
    updateDisplay();
}

// Set the next question
function setNextQuestion() {
    currentQuestion = generateQuestion();
    val1Element.textContent = currentQuestion.value1;
    operatorElement.textContent = currentQuestion.operator;
    val2Element.textContent = currentQuestion.value2;
}

// Update display elements
function updateDisplay() {
    scoreValueElement.textContent = currentScore;
    timerValueElement.textContent = timeLeft;
}

// Initialize game state
function initGameState() {
    answerInput.disabled = true;
    updateDisplay();
}
function generateQuestion() {
    let num1, num2, operator, answer;
    let questionKey = '';

    // Keep generating until we get a unique question
    while ((questionKey === '' || previousQuestions.has(questionKey)) && previousQuestions.size < MAX_TRACKED_QUESTIONS) {
        // Select random operator (0-3)
        const opIndex = Math.floor(Math.random() * 4);
        operator = ['+', '-', '*', '/'][opIndex];

        // Generate numbers based on level and operator
        if (opIndex === 0) { // Addition
            const ranges = [
                [4, 12, 2, 14],      // Level 1: num1(3-15), num2(2-10)
                [10, 25, 5, 15],     // Level 2
                [10, 30, 15, 40],    // Level 3
                [20, 50, 15, 40],    // Level 4
                [20, 60, 30, 80]     // Level 5
            ];
            const [min1, max1, min2, max2] = ranges[currentLevel - 1];
            num1 = getRandomNumber(min1, max1);
            num2 = getRandomNumber(min2, max2);
            answer = num1 + num2;

        } else if (opIndex === 1) { // Subtraction
            const ranges = [
                [5, 20, 1, 10],      // Level 1
                [15, 30, 5, 15],     // Level 2
                [25, 50, 10, 25],    // Level 3
                [30, 70, 15, 40],    // Level 4
                [40, 100, 20, 60]    // Level 5
            ];
            const [min1, max1, min2, max2] = ranges[currentLevel - 1];
            num1 = getRandomNumber(min1, max1);
            num2 = getRandomNumber(min2, max2);
            if (num2 > num1) [num1, num2] = [num2, num1]; // Ensure positive result
            answer = num1 - num2;

        } else if (opIndex === 2) { // Multiplication
            const ranges = [
                [1, 5, 2, 4],        // Level 1
                [3, 8, 2, 6],        // Level 2
                [4, 10, 5, 8],       // Level 3
                [6, 12, 5, 10],      // Level 4
                [8, 15, 7, 12]       // Level 5
            ];
            const [min1, max1, min2, max2] = ranges[currentLevel - 1];
            num1 = getRandomNumber(min1, max1);
            num2 = getRandomNumber(min2, max2);
            answer = num1 * num2;

        } else { // Division
            const ranges = [
                [1, 5, 2, 7],        // Level 1
                [2, 15, 3, 11],        // Level 2
                [5, 18, 7, 12],        // Level 3
                [7, 20, 9, 15],      // Level 4
                [10, 22, 11, 20]       // Level 5
            ];
            const [min1, max1, min2, max2] = ranges[currentLevel - 1];
            num2 = getRandomNumber(min1, max1);
            answer = getRandomNumber(min2, max2);
            num1 = num2 * answer;
        }

        questionKey = `${num1}${operator}${num2}`;
    }

    // Add this question to the set of previously asked questions
    previousQuestions.add(questionKey);

    // Manage memory by removing old questions when needed
    if (previousQuestions.size > MAX_TRACKED_QUESTIONS) {
        previousQuestions = new Set(Array.from(previousQuestions).slice(40));
    }

    return { value1: num1, value2: num2, operator, answer };
}


// Get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the game
initGameState();