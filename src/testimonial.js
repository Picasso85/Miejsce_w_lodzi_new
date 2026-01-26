const testimonials = [
  {
    stars: 5,
    text: "Wspaniały sposób na poznanie Oświęcimia z innej perspektywy! Przewodnik opowiadał fascynujące historie o mieście. Polecam każdemu, kto szuka ciekawej atrakcji.",
    author: "Anna K.",
    avatar: "assets/avatars/1.png",
    photo: "assets/img1.jpg"
  },
  {
    stars: 5,
    text: "Zorganizowaliśmy rejs firmowy i wszyscy byli zachwyceni! Profesjonalna obsługa, piękne widoki i niezapomniane wrażenia. Na pewno jeszcze skorzystamy.",
    author: "Marek W.",
    avatar: "assets/avatars/2.png",
    photo: "assets/img2.jpg"
  },
  {
    stars: 4.5,
    text: "Rejs o zachodzie słońca to był strzał w dziesiątkę na naszą rocznicę. Romantyczna atmosfera, lampka wina i cudowne widoki. Polecam parom szukającym czegoś wyjątkowego.",
    author: "Katarzyna i Piotr",
    avatar: "assets/avatars/3.png",
    photo: "assets/img3.jpg"
  }
];

const grid = document.getElementById('testimonialGrid');

testimonials.forEach(t => {
  const tile = document.createElement('div');
  tile.classList.add('testimonial');

  let starsHtml = '';
  for (let i = 0; i < Math.floor(t.stars); i++) starsHtml += '<i class="fas fa-star"></i>';
  if (t.stars % 1 !== 0) starsHtml += '<i class="fas fa-star-half-alt"></i>';

  tile.innerHTML = `
    <div class="testimonial-inner">
      <div class="testimonial-front">
        <div class="testimonial-content">
          <div class="testimonial-stars">${starsHtml}</div>
          <p>${t.text}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar"><img src="${t.avatar}" alt="${t.author}"></div>
            <div class="testimonial-name">${t.author}</div>
          </div>
        </div>
      </div>
      <div class="testimonial-back">
        <img src="${t.photo}" alt="${t.author}">
      </div>
    </div>
  `;
  grid.appendChild(tile);
});