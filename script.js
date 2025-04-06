document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');

    // Function to move the "No" button to a random position
    const moveNoButton = () => {
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        const noBtnRect = noBtn.getBoundingClientRect();

        // Get random position within the viewport, ensuring the button stays visible
        const maxX = window.innerWidth - noBtnRect.width;
        const maxY = window.innerHeight - noBtnRect.height;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        // Apply the new position
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    };

    // Move the "No" button when clicked or hovered
    noBtn.addEventListener('click', moveNoButton);
    noBtn.addEventListener('mouseover', moveNoButton);
});