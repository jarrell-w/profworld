// Import session handling functions
import { redirectToLogin } from './session-handler.js';
// Store the path of the images in an array
var backgrounds = ["/js/images/bg/bg0.png", "/js/images/bg/bg6.png", "/js/images/bg/bg9.jpg"];
window.onload = function() {
  // Get a random index
  var index = Math.floor(Math.random() * backgrounds.length);
  // Modify the background image of the body 
  document.body.style.background = "url('" + backgrounds[index] + "')";
  // These css stylings are to make sure the image fits the page correctly
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
};
// Function to handle login form submission
async function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://107.22.94.12:443/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: email, password })
        });

        if (response.ok) {
            // Login Successful
            const responseData = await response.json();
            
            // Store user data in session storage
            sessionStorage.setItem('user_id', responseData.user_id);
            sessionStorage.setItem('isAdmin', responseData.isAdmin);

            // Redirect to the admin page
            window.location.href = 'admin.html';
        } else if (response.status === 401) {
            // Unauthorized: Invalid login credentials
            window.alert('Login failed: Invalid email or password');
        } else {
            // Other errors
            window.alert('Login Failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during user login:', error);
        // Handle other errors if necessary
        window.alert('An error occurred during login. Please try again later.');
    }
}

// Attach the event listener to the login form
document.getElementById('submit-login').addEventListener('click', handleLoginSubmit);