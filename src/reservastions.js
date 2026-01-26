const cruiseType = document.getElementById('cruise-type');
const cruiseTime = document.getElementById('cruise-time');

cruiseType.addEventListener('change', () => {
  const selected = cruiseType.value;

  if (selected === 'Tyniec' || selected === 'Kraków') {
    // ustawienie godziny na 08:00 i zablokowanie pola
    cruiseTime.value = '08:00';
    cruiseTime.disabled = true;
  } else if (selected === 'Kajaki' || selected === 'Kursy') {
    // dla Kajaki i Kurs Sternika wyłączamy całkowicie wybór godziny
    cruiseTime.value = '';
    cruiseTime.disabled = true;
  } else {
    // dla pozostałych opcji pole aktywne
    cruiseTime.value = '';
    cruiseTime.disabled = false;
  }
});