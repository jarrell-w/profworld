//set up elements, questions, and user stats
const question = document.getElementById('current-question');
const option1 = document.getElementById('option1-label');
const option2 = document.getElementById('option2-label');
const option3 = document.getElementById('option3-label');
const option4 = document.getElementById('option4-label');
const option4Radio = document.getElementById('option4')
const option5 = document.getElementById('option5-label');
const submitAnswer = document.getElementById('question-submit-button')
const questionTracker = document.getElementById('question-tracker')
const questionSubmitButton = document.getElementById('question-submit-button')
const questionImg = document.getElementById('question-img')

let userScore = 0
let numberOfCorrect = 0
let questionCounter = 0
let answerBank = []
let userAnswers = []
let questions = []

document.addEventListener('DOMContentLoaded', function() {
    if(window.location.pathname == '/question.html') {
        loadTest()
    } else {
        return
    }
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
            if(saveUserAnswer()) {
            questionCounter++
            loadFirstQuestion(questions) 
            } else {
                userAnswers.shift()
                alert("Please select an answer.")
            }
            
        } else {
            saveUserAnswer()
            checkAnswers(userAnswers, answerBank)
        }
        
    })
    
    //grab the questions from the flask server as JSON array (array of objects in this case).
    
    const data = JSON.parse(localStorage.getItem('testData'))
    const isTimedKey = 'isTimed'
    for(problem of data) {
        if(problem.isTimed) {
            startTimer()
        }
    }
    const dataWithoutTimerKey = data.filter(obj => !obj.hasOwnProperty(isTimedKey))
    for (problem of dataWithoutTimerKey) {
        questions.push(problem)
        answerBank.push(problem.answer)
    }
    loadFirstQuestion(dataWithoutTimerKey)

    

}

const loadFirstQuestion = (questionSet) => {
    //set the html elements to their respective value in the objects 
    //I.E questionSet[questionCounter].question grabs the object(problem) at the 
    //first index and sets the h2 element in the browser to the text contents of it
    questionTracker.innerText = `${questionCounter + 1} of ${questions.length}`
    question.innerText= questionSet[questionCounter].question

    console.log(questionSet[questionCounter]['incorrect4'])
    if(!questionSet[questionCounter]['incorrect4']) {
        const optionsArray = [
            questionSet[questionCounter]['incorrect1'],
            questionSet[questionCounter]['incorrect2'],
            questionSet[questionCounter]['incorrect3'],
            questionSet[questionCounter].answer
        ]
        option4.style.display = 'none'
        option4Radio.style.display = 'none'
        const shuffledArray = shuffleArray(optionsArray)
        option1.innerText = shuffledArray[0];
        option2.innerText = shuffledArray[1];
        option3.innerText = shuffledArray[2];
        option5.innerText = shuffledArray[3];
        questionImg.src = questionSet[questionCounter].image
    } else {
        const optionsArray = [
            questionSet[questionCounter]['incorrect1'],
            questionSet[questionCounter]['incorrect2'],
            questionSet[questionCounter]['incorrect3'],
            questionSet[questionCounter]['incorrect4'],
            questionSet[questionCounter].answer
        ]
        option4.style.display = 'inline'
        option4Radio.style.display = 'inline'
        const shuffledArray = shuffleArray(optionsArray)
        option1.innerText = shuffledArray[0];
        option2.innerText = shuffledArray[1];
        option3.innerText = shuffledArray[2];
        option4.innerText = shuffledArray[3]
        option5.innerText = shuffledArray[4];
        questionImg.src = questionSet[questionCounter].image
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
        //for the actual text content for the selected option through its label.
        const labelForRadioButton = document.querySelector(`label[for="${selectedOption.id}"]`);
        const labelText = labelForRadioButton.innerText;
        userAnswers.push(labelText);
        return true
    } else {
        console.error('No option selected');
        return false
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
   submitAnswer.style.display = 'none'
   console.log(userAnswers, answerBank)
    userScore = 0
    numberOfCorrect = 0
    questionCounter = 0
    localStorage.removeItem('testData')
    stopTimer()
   
}

let startTime;
let timerInterval;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); 
}
function stopTimer() {
    clearInterval(timerInterval); 
}
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime; 

  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

  const formattedTime =
    padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);
  document.getElementById('timer').innerHTML = formattedTime;
}

function padZero(num) {
  return (num < 10 ? '0' : '') + num; 
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}