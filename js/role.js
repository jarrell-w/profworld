document.addEventListener("DOMContentLoaded", function () {
    // Fetch user role when the page loads
    fetch('http://107.22.94.12:443/user_role')
        .then(response => response.json())
        .then(data => {
            const welcomeMessage = document.getElementById('welcomeMessage');
            if (data.isAdmin === 1) {
                welcomeMessage.textContent = 'Welcome admin!';
            } else {
                welcomeMessage.textContent = 'Welcome student!';
            }
        })
        .catch(error => console.error('Error fetching user role:', error));
});
