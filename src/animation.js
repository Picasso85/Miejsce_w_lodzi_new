document.addEventListener("DOMContentLoaded", function () {
    const text = document.querySelector(".animated-text");
    const letters = text.textContent.split("");

    text.textContent = "";

    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = (index * 0.05) + "s";
        text.appendChild(span);
    });
});