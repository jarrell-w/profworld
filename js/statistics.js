// Import session handling functions
import { isLoggedIn, user_role, redirectToLogin } from './session-handler.js';

// Function to initialize the welcome page
function initializeWelcomePage() {
    // Redirect to login if not logged in
    redirectToLogin();

    // Get the user's role
    const role = user_role();

    // Print a welcome message based on the user's role
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome ${role === 'admin' ? 'Admin' : 'Student'}`;
    }

    // Additional welcome page initialization...

    const urlParams = new URLSearchParams(window.location.search);
    const correctAnswers = urlParams.get('correct');

    // Ensure the script is enclosed in proper <script> tags
    const totalCorrectElement = document.getElementById('totalCorrect');
    if (totalCorrectElement) {
        totalCorrectElement.textContent = correctAnswers;
    }

    // Additional welcome page logic...

    const userId = sessionStorage.getItem('user_id');
    const isAdmin = sessionStorage.getItem('isAdmin');

    if (!userId || isAdmin === null) {
        window.location.href = '/';  // Redirect to login if not logged in
    }

    // Use userId and isAdmin as needed in your welcome page

    // Logout logic...

}

// Initialize the welcome page when the document is ready
document.addEventListener('DOMContentLoaded', initializeWelcomePage);