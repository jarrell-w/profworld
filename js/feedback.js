const emailLinks = document.querySelectorAll('.contact-table td:nth-child(2)');

// Add a click event listener to each email link
emailLinks.forEach(link => {
    link.addEventListener('click', () => {
        const email = link.textContent;
        window.location.href = `mailto:${email}`;
    });
});