    const questionInfoInput = document.getElementById('questionInfo')
    const correctAnswerInput = document.getElementById('correctAnswerInput')
    const incorrectQuestionInput1 = document.getElementById('incorrectAnswer1')
    const incorrectQuestionInput2 = document.getElementById('incorrectAnswer2')
    const incorrectQuestionInput3 = document.getElementById('incorrectAnswer3')
    const incorrectQuestionInput4 = document.getElementById('incorrectAnswer4')
    const deleteForm = document.getElementById('deleteQuestionForm')
    const listOfQuestions = document.getElementById('listOfQuestions')
    const paginationBar = document.getElementById('pagination')
    const paginationList = document.getElementById('paginationList')
    const questionCard = document.getElementById('questionCard')
    const categoryGroup = 'categoryTagOptions'
    const treatmentGroup = 'treatmentTechniqueOptions'
    const bodyRegionGroup = 'bodyRegionOptions'
    
    
    const clearFields = () => {
        questionInfoInput.value = ''
        correctAnswerInput.value = ''
        incorrectQuestionInput1.value = ''
        incorrectQuestionInput2.value = ''
        incorrectQuestionInput3.value = ''
        incorrectQuestionInput4.value = ''
        clearRadioButtons(categoryGroup)
        clearRadioButtons(treatmentGroup)
        clearRadioButtons(bodyRegionGroup)
    }
    
    const clearRadioButtons = (group) => {
        const nestedCheckboxes = document.querySelectorAll(`input[name='${group}']`);
        nestedCheckboxes.forEach(radioButton => radioButton.checked=false)
    }
    
    const handleAddQuestionSubmit = async () => {
        event.preventDefault()
        const category = getSelectedOption(categoryGroup)
        const treatment = getSelectedOption(treatmentGroup)
        const region = getSelectedOption(bodyRegionGroup)
        let params = {
            image: '',
            explanation: '',
            categoryTag: category,
            treatmentTag: treatment,
            regionTag: region,
            questionInfo: questionInfoInput.value,
            incorrectAnswer1: incorrectQuestionInput1.value,
            incorrectAnswer2: incorrectQuestionInput2.value,
            incorrectAnswer3: incorrectQuestionInput3.value,
            incorrectAnswer4: incorrectQuestionInput4.value,
            correctAnswer: correctAnswerInput.value
        };
        // Send an HTTP request to the Python script via fetch
        try {
      const response = await fetch('http://107.22.94.12:443/add_questions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params) 
    });
        const data = await response.json();
        console.log(data)
        alert('Question Added Successfully')
        
    } catch (error) {console.error('Error fetching data:', error)}
    clearFields()
    
    }
    
    function getSelectedOption(checkboxGroupName) {
        const nestedCheckboxes = document.querySelectorAll(`input[name='${checkboxGroupName}']`);
        let selectedOption
        for(const option of nestedCheckboxes) {
            if(option.checked) {
                selectedOption = nestedCheckboxes[0].parentNode.textContent.trim();
                break;
            }
        }
    
    
        return selectedOption;
    }
    
    
    const populateAllQuestions = async () => {
        try {
            const response = await fetch('http://107.22.94.12:443/get_data');
            const data = await response.json();
            formatQuestions(data)
            console.log(data)
          } catch (error) {console.error('Error fetching data:', error)}
    }
    
    const formatQuestions = (questionsObject) => {
        
        let questionNumber = 1
        for (question of questionsObject) {
            const questionID = document.createElement('p')
            const questionIDText = document.createTextNode(`Question ID: ${question['problem_id']}`)
            questionID.appendChild(questionIDText)
            const questionBox = document.createElement('li')
            questionBox.classList.add('quiz-card')
            questionBox.classList.add('my-3')
            questionBox.id = `questionCard${questionNumber}`
            const questionBoxText= document.createElement('p')
            questionBoxText.classList.add('question-text')
            questionID.classList.add('question-text')
            const questionText = document.createTextNode(question.question)
            questionBoxText.appendChild(questionID)
            questionBoxText.appendChild(questionText)
            questionBox.appendChild(questionBoxText)
            listOfQuestions.appendChild(questionBox)
        }
    }
    
    const deleteQuestion = async () => {
        event.preventDefault();
        let questionToDelete = document.getElementById('deleteQuestionId').value;
        let params = {
            problem_id: questionToDelete
        };
        try {
            const response = await fetch('http://107.22.94.12:443/delete_question', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            const data = await response.json();
            console.log(data);
            
            if (response.ok) {
                const confirmation = window.confirm('Question Deleted. Reload the page?');
                if (confirmation) {
                    location.reload();
                }
            } else {
                alert('Deletion unsuccessful');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }
    
    const addQuestionForm = document.getElementById('addQuestionForm').addEventListener('submit', handleAddQuestionSubmit)
    
    //Delete Question Logic
    document.addEventListener('DOMContentLoaded', function() {
        if(window.location.pathname == '/question_bank.html') {
            populateAllQuestions()
        } else {
            return
        }
    });
    
    deleteForm.addEventListener('submit', deleteQuestion)
    
   const handleEditQuestionSubmit = async (event) => {
    event.preventDefault();

    // Move the variable declarations inside the function
    const questionInfoInput = document.getElementById('editQuestionInfo');
    const correctAnswerInput = document.getElementById('editCorrectAnswerInput');
    const incorrectQuestionInput1 = document.getElementById('editIncorrectAnswer1');
    const incorrectQuestionInput2 = document.getElementById('editIncorrectAnswer2');
    const incorrectQuestionInput3 = document.getElementById('editIncorrectAnswer3');
    const incorrectQuestionInput4 = document.getElementById('editIncorrectAnswer4');

    const category = getSelectedOption(categoryGroup);
    const treatment = getSelectedOption(treatmentGroup);
    const region = getSelectedOption(bodyRegionGroup);

    let params = {
        problem_id: problemId,
        questionInfo: questionInfoInput.value,
        correctAnswer: correctAnswerInput.value,
        incorrectAnswer1: incorrectQuestionInput1.value,
        incorrectAnswer2: incorrectQuestionInput2.value,
        incorrectAnswer3: incorrectQuestionInput3.value,
        incorrectAnswer4: incorrectQuestionInput4.value,
        categoryTag: category,
        treatmentTag: treatment,
        regionTag: region,
        explanation: '',
        image: '',
    };

    try {
        const response = await fetch('http://107.22.94.12:443/edit_question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert('Question Edited Successfully');
            // You can add logic here to update the UI or redirect to a different page if needed.
        } else {
            alert('Editing unsuccessful');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    clearFields();
};

editForm.addEventListener('submit', handleEditQuestionSubmit);