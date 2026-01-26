const cruiseType = document.getElementById('cruise-type');
const cruiseTime = document.getElementById('cruise-time');

cruiseType.addEventListener('change', () => {
  const selected = cruiseType.value;

  if (selected === 'Tyniec' || selected === 'Kraków' || selected === 'Kursy' || selected === 'Kajaki') {
    // ustawiamy godzinę na 08:00 i blokujemy zmianę
    cruiseTime.value = '08:00';
    cruiseTime.disabled = true;
  } else {
    // odblokowujemy pole i resetujemy wybór
    cruiseTime.disabled = false;
    cruiseTime.value = '';
  }
});