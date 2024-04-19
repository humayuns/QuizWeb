let currentQuestion = 0;
let score = 0;
let attempts = [];
let questions = [];

function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            attempts = new Array(questions.length).fill(false);
            displayQuestion();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}

// add a function that loads the questions from a JSON text stored in json-input
function loadQuestionsFromInput() {
    const jsonInput = document.getElementById("json-input");

    // save input to localstorage
    localStorage.setItem("json-input", jsonInput.value);

    questions = JSON.parse(jsonInput.value);
    attempts = new Array(questions.length).fill(false);
    displayQuestion();
}


function displayQuestion() {
    const question = questions[currentQuestion];
    const questionContainer = document.getElementById("question");
    const progressText = document.getElementById("progress-text");

    // Displaying the question text and progress
    questionContainer.textContent = question.question;
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

    // Display each answer with a span for emoji feedback
    question.answers.forEach((answer, index) => {
        const inputId = `ans${index + 1}`;
        const labelId = `label${index + 1}`;
        const input = document.getElementById(inputId);
        const label = document.getElementById(labelId);

        label.innerHTML = `${answer} <span class="emoji"></span>`;
        input.checked = false; // Reset checked state when displaying new question
        input.disabled = false; // Ensure inputs are enabled
    });

    updateProgressBar();
    attachAnswerHandlers();
}

function attachAnswerHandlers() {
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.onclick = () => {
            evaluateAnswer(input);
            disableAllAnswers(); // Disable further selection after one choice
        };
    });
}

function evaluateAnswer(selectedInput) {
    const selectedAnswerIndex = parseInt(selectedInput.value) - 1;
    const correctAnswerIndex = questions[currentQuestion].correct - 1;
    let emojiSpans = document.querySelectorAll('.emoji');

    // Clear previous emojis
    emojiSpans.forEach(span => span.textContent = '');

    // Check if the selected answer is correct
    if (selectedAnswerIndex === correctAnswerIndex) {
        emojiSpans[selectedAnswerIndex].textContent = '✅';
        if (!attempts[currentQuestion]) {
            score++;
        }
    } else {
        emojiSpans[selectedAnswerIndex].textContent = '❌';
    }

    // Always show the correct answer
    emojiSpans[correctAnswerIndex].textContent = '✅';

    // Mark this question as attempted
    attempts[currentQuestion] = true;
}

function disableAllAnswers() {
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.disabled = true;
    });
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${(currentQuestion + 1) / questions.length * 100}%`;
}

function showResults() {
    const result = document.getElementById("result");
    result.innerHTML = `Quiz completed! Your score: ${score} out of ${questions.length} <a href="index.html">Try again</a>`;
    document.querySelector(".buttons").style.display = "none";
    document.querySelector(".question").style.display = "none";
    document.querySelector("ul").style.display = "none";
}

window.onload = function() {
    // load input from localstorage
    const jsonInput = document.getElementById("json-input");
    // if there is a saved input, load it
    if (localStorage.getItem("json-input")) {
        jsonInput.value = localStorage.getItem("json-input");
    }
    // if there is a value in input then load questions from input
    if (jsonInput.value) {
        loadQuestionsFromInput();
    } else {
    loadQuestions();
    }
};
