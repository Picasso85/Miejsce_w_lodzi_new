// Punkty tworzące kształt łódki
const boatPoints = [
  // Kadłub (punkty tworzące kształt łodzi)
  { x: 150, y: 140, startX: -100, startY: 300, delay: 0 },
  { x: 80, y: 160, startX: 500, startY: -100, delay: 0.1 },
  { x: 60, y: 180, startX: 100, startY: 400, delay: 0.2 },
  { x: 100, y: 180, startX: -200, startY: 200, delay: 0.3 },
  { x: 200, y: 180, startX: 600, startY: 100, delay: 0.4 },
  { x: 240, y: 180, startX: 300, startY: -200, delay: 0.5 },
  { x: 220, y: 160, startX: -100, startY: -100, delay: 0.6 },
  { x: 150, y: 140, startX: 400, startY: 300, delay: 0.7 },
  
  // Maszt
  { x: 150, y: 80, startX: 200, startY: 400, delay: 0.8 },
  { x: 150, y: 40, startX: -100, startY: -200, delay: 0.9 },
  
  // Żagle
  { x: 120, y: 60, startX: 300, startY: 200, delay: 1.0 },
  { x: 180, y: 60, startX: -200, startY: 300, delay: 1.1 },
  { x: 150, y: 20, startX: 400, startY: -100, delay: 1.2 },
  
  // Flaga
  { x: 150, y: 10, startX: 100, startY: 400, delay: 1.3 },
  { x: 170, y: 20, startX: -300, startY: 100, delay: 1.4 }
];

const boatPointsContainer = document.querySelector('.boat-points');

boatPoints.forEach((point, index) => {
  const pointElement = document.createElement('div');
  pointElement.className = 'boat-point';
  pointElement.style.setProperty('--start-x', `${point.startX}px`);
  pointElement.style.setProperty('--start-y', `${point.startY}px`);
  pointElement.style.setProperty('--end-x', `${point.x}px`);
  pointElement.style.setProperty('--end-y', `${point.y}px`);
  pointElement.style.setProperty('--delay', `${point.delay}s`);
  pointElement.style.left = `${point.x}px`;
  pointElement.style.top = `${point.y}px`;
  
  boatPointsContainer.appendChild(pointElement);
});

// Animacja liter w napisach
const leftText = document.querySelector('.left-sail-text');
const rightText = document.querySelector('.right-sail-text');

const leftChars = leftText.querySelectorAll('.text-wave');
const rightChars = rightText.querySelectorAll('.text-wave');

leftChars.forEach((char, index) => {
  char.style.setProperty('--char-index', index);
});

rightChars.forEach((char, index) => {
  char.style.setProperty('--char-index', index + 4);
});

// Dodajemy ptaki z losowymi opóźnieniami
document.querySelectorAll('.bird').forEach(bird => {
  const randomDelay = Math.random() * 5 + 2;
  bird.style.animationDelay = `${randomDelay}s`;
});

// Dodajmy refleksy słoneczne na wodzie
for (let i = 0; i < 10; i++) {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position: absolute;
    width: ${Math.random() * 20 + 5}px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    bottom: ${Math.random() * 30 + 10}%;
    left: ${Math.random() * 100}%;
    opacity: ${Math.random() * 0.5 + 0.2};
    animation: sparkleMove ${Math.random() * 10 + 5}s linear infinite;
    animation-delay: ${Math.random() * 5}s;
  `;
  document.querySelector('.ocean-scene').appendChild(sparkle);
}

// Dodaj styl dla iskier
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkleMove {
    0% { transform: translateX(0); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.7; }
    100% { transform: translateX(${Math.random() * 200 - 100}px); opacity: 0; }
  }
`;
document.head.appendChild(style);