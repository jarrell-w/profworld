document.getElementById("loginButton").addEventListener("click", function() {
    document.getElementById("loginPopup").style.display = "block";
});

document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("loginPopup").style.display = "none";
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // You can add your login logic here and redirect the user upon successful login.
});
