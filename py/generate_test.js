const question = document.getElementById('current-question');
const optionsContainer = document.getElementById('options');
const submitAnswer = document.getElementById('question-submit-button');
const questionTracker = document.getElementById('question-tracker');
const questionSubmitButton = document.getElementById('question-submit-button');

let userScore = 0;
let numberOfCorrect = 0;
let questionCounter = 0;
let answerBank = [];
let userAnswers = [];
let questions = [];
let data
//this is just a test. When the dom content is loaded, it grabs the questions.
document.addEventListener('DOMContentLoaded', function () {
            loadTest();
        }); 

async function loadTest() {
    //if we aren't at the last question, save the user answer and update UI
    //else save user answer and check the answers
    submitAnswer.addEventListener('click', function () {
        event.preventDefault()
        if(questionCounter == questions.length - 2) {
            questionSubmitButton.innerText = 'Submit'
        }
        if(questionCounter != questions.length - 1) {
            saveUserAnswer()
        questionCounter++
        loadFirstQuestion(questions)
        } else {
            saveUserAnswer()
            checkAnswers(userAnswers, answerBank)
        }
        
    })
    //grab the questions from the flask server as JSON array (array of objects in this case).
    try {
        const response = await fetch('http://107.22.94.12:443/get_data');
        const data = await response.json();
        console.log(data)
        //for every element in our array of objects, push the entire object into a question array
        //Then push the actual answer of the question to another array
        for (problem of data) {
            questions.push(problem)
            answerBank.push(problem.answer)
        }
        // Process the data and update the HTML
        loadFirstQuestion(data)
    } catch (error) {console.error('Error fetching data:', error)}

}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const loadFirstQuestion = (questionSet) => {
    // Set the html elements to their respective values in the objects
    questionTracker.innerText = `${questionCounter + 1} of ${questions.length}`;
    question.innerText = questionSet[questionCounter].question;

    // Create an array of answer options including correct and incorrect options
    const answerOptions = [
        questionSet[questionCounter]['incorrect1'],
        questionSet[questionCounter]['incorrect2'],
        questionSet[questionCounter]['incorrect3'],
        questionSet[questionCounter]['incorrect4'],
        questionSet[questionCounter].answer
    ];

    // Shuffle the answer options
    shuffleArray(answerOptions);

    // Update the text content of the options using the dynamic array
    optionsContainer.innerHTML = ''; // Clear previous options

    // Update the number of options dynamically
    for (let i = 0; i < Math.min(answerOptions.length, 4); i++) {
        const optionContainer = document.createElement('div');
        const radioButton = document.createElement('input');
        const label = document.createElement('label');

        radioButton.type = 'radio';
        radioButton.name = 'option';
        radioButton.value = `option${i + 1}`;
        radioButton.required = true;

        label.htmlFor = `option${i + 1}`;
        label.id = `option${i + 1}-label`;
        label.innerText = answerOptions[i];

        optionContainer.appendChild(radioButton);
        optionContainer.appendChild(label);
        optionsContainer.appendChild(optionContainer);
    }

    // Hide the fifth option if there are only four options
    if (questionSet[questionCounter]['incorrect4'] === "") {
        document.getElementById('option5').style.display = 'none';
    } else {
        document.getElementById('option5').style.display = 'block';
    }
}


const saveUserAnswer = () => {
    //get the list of options by name attribute, which returns an array of the elements
    const options = document.getElementsByName('option');
    let selectedOption;
    //loop through the array of options and check which one has a "checked" property of true
    for (const option of options) {
        if (option.checked) {
            selectedOption = option;
            break;
        }
    }

    if (selectedOption) {
        //fer the actual text content for the selected option through its label.
        const labelForRadioButton = document.querySelector(`label[for="${selectedOption.id}"]`);
        const labelText = labelForRadioButton.innerText;
        userAnswers.push(labelText);
    } else {
        console.error('No option selected');
    }
}

const changeQuestion = (data) => {
    //update the respective fields for questions after the first one 
    if(questions[questionCounter]) {
        question.innerText= questions[questionCounter].question
        option1.innerText=questions[questionCounter]['incorrect1']
        option2.innerText=questions[questionCounter]['incorrect2']
        option3.innerText=questions[questionCounter]['incorrect3']
        option4.innerText=questions[questionCounter]['incorrect4']
        option5.innerText=questions[questionCounter].answer
    }

}

const checkAnswers= (userAnswers, answerBank) => {
    //check if the users answers match the answer in the answer bank
   for (let i = 0; i < userAnswers.length; i++) {
    if(userAnswers[i] == answerBank[i]) {
        userScore++
    }
   }
   alert(`You scored ${userScore} out of ${questions.length}`)
    userScore = 0
    numberOfCorrect = 0
    questionCounter = 0
   
}