window.onload = function(){
  
  let dropdownCheckboxes = document.getElementsByClassName('dropdownCheckbox');
  
  [].forEach.call(dropdownCheckboxes, function(checkbox) {
    checkbox.addEventListener('change', function() {
      let targetId = this.id + "List";
      let targetDiv = document.getElementById(targetId);
  
      if(this.checked) {
        targetDiv.style.display = "block";
      } else {
        targetDiv.style.display = "none";
      }
    });
  });
}
