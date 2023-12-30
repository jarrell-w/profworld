var categoryCheckbox = document.getElementById("categoryCheckbox");
          var nestedCategoryCheckbox = document.getElementById("nestedCategoryCheckbox");
          nestedCategoryCheckbox.style.display = "none";
          categoryCheckbox.addEventListener("click", function() {
            if (nestedCategoryCheckbox.style.display === "none") {
              nestedCategoryCheckbox.style.display = "block";
            } else {
              nestedCategoryCheckbox.style.display = "none";
            }
          });
        var bodyRegionCheckbox = document.getElementById("bodyRegionCheckbox");
        var nestedBodyRegionCheckbox = document.getElementById("nestedBodyRegionCheckbox");
        nestedBodyRegionCheckbox.style.display = "none";
        bodyRegionCheckbox.addEventListener("click", function() {
            if (nestedBodyRegionCheckbox.style.display === "none") {
                nestedBodyRegionCheckbox.style.display = "block";
            } else {
                nestedBodyRegionCheckbox.style.display = "none";
            }
        });
        var treatmentTechniquesCheckbox = document.getElementById("treatmentTechniquesCheckbox");
        var nestedTreatmentTechniquesCheckbox = document.getElementById("nestedTreatmentTechniquesCheckbox");
        nestedTreatmentTechniquesCheckbox.style.display = "none";
        treatmentTechniquesCheckbox.addEventListener("click", function() {
            if (nestedTreatmentTechniquesCheckbox.style.display === "none") {
                nestedTreatmentTechniquesCheckbox.style.display = "block";
            } else {
                nestedTreatmentTechniquesCheckbox.style.display = "none";
            }
        });