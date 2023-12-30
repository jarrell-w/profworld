const generateTestButton = document.getElementById('generateTestButton')
generateTestButton.addEventListener('click', generateTest)
    
    
    
    async function generateTest() {
        // Check if the main checkboxes are selected
        const categoryCheckbox = document.getElementById("categoryCheckbox");
        const bodyRegionCheckbox = document.getElementById("bodyRegionCheckbox");
        const treatmentTechniquesCheckbox = document.getElementById("treatmentTechniquesCheckbox");

        if (!categoryCheckbox.checked || !bodyRegionCheckbox.checked || !treatmentTechniquesCheckbox.checked) {
            alert("Please select a category, body region, and treatment techniques before generating the test.");
            return;
        }
        else {
        
            // Check if the nested checkboxes are selected
        const nestedCategoryCheckboxes = document.querySelectorAll("#nestedCategoryCheckbox input[type='checkbox']");
        const nestedBodyRegionCheckboxes = document.querySelectorAll("#nestedBodyRegionCheckbox input[type='checkbox']");
        const nestedTreatmentTechniquesCheckboxes = document.querySelectorAll("#nestedTreatmentTechniquesCheckbox input[type='checkbox']");

        if (!isAtLeastOneCheckboxSelected(nestedCategoryCheckboxes) ||
            !isAtLeastOneCheckboxSelected(nestedBodyRegionCheckboxes) ||
            !isAtLeastOneCheckboxSelected(nestedTreatmentTechniquesCheckboxes)) {
            alert("Please select at least one subcategory for category, body region, and treatment techniques.");
            return;
        } else {
        const selectedCategories = getSelectedOptions("nestedCategoryCheckbox");
        const selectedBodyRegions = getSelectedOptions("nestedBodyRegionCheckbox");
        const selectedTreatmentTechniques = getSelectedOptions("nestedTreatmentTechniquesCheckbox");


        // If all checks pass, proceed with generating the test
        //this is the object that is being converted to a JSON string and passed to the server.
        let params = {
            // Collect data from the checkboxes, sliders, etc.
            user_id: 123, // Replace this with actual user ID
            problem_count: document.getElementById("questionCount").value,
            category_tag: categoryCheckbox.checked,
            region_tag: bodyRegionCheckbox.checked,
            treatment_tag: treatmentTechniquesCheckbox.checked,
            selected_categories: selectedCategories,
            selected_body_regions: selectedBodyRegions,
            selected_treatment_techniques: selectedTreatmentTechniques
            // Add other parameters as needed
        };
        console.log(params)

        // Send an HTTP request to the Python script via fetch
        try {
      const response = await fetch('http://107.22.94.12:443/create_test', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'},
    body: JSON.stringify(params) });
    
    
        const data = await response.json();
        localStorage.setItem('testData', JSON.stringify(data))
        window.location.href='/question.html'
        
        //for every element in our array of objects, push the entire object into a question array
        //Then push the actual answer of the question to another array
        
    } catch (error) {console.error('Error fetching data:', error)}
        }
        
        
        }

        
    
    }

    function isAtLeastOneCheckboxSelected(checkboxes) {
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                return true;
            }
        }
        return false;
    }
    function getSelectedOptions(checkboxGroupName) {
    const nestedCheckboxes = document.querySelectorAll(`#${checkboxGroupName} input[type='checkbox']`);
    const selectedOptions = [];

    for (const checkbox of nestedCheckboxes) {
        if (checkbox.checked) {
            selectedOptions.push(checkbox.nextElementSibling.textContent.trim());
        }
    }

    return selectedOptions;
}