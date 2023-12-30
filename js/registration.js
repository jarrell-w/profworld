// Store the path of the images in an array
var backgrounds = ["/js/images/bg/bg0.png", "/js/images/bg/bg6.png", "/js/images/bg/bg9.jpg"];
window.onload = function() {
  // Get a random index
  var index = Math.floor(Math.random() * backgrounds.length);
  // Modify the background image of the body 
  document.body.style.background = "url('" + backgrounds[index] + "')";
  // These CSS stylings are to make sure the image fits the page correctly
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
};

async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://107.22.94.12:443/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Registration Successful
            window.alert('Registration Successful');
            
            // Redirect to the login screen (index.html)
            window.location.href = 'index.html';
        } else if (response.status === 409) {
            // Conflict: Duplicate email
            window.alert('Registration failed: An account is already registered to this email');
        } else {
            // Other errors
            window.alert('Registration Failed. Please try again.');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        // Handle other errors if necessary
        window.alert('An error occurred during registration. Please try again later.');
    }
}