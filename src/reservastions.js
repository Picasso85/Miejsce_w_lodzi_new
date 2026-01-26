const cruiseType = document.getElementById('cruise-type');
const cruiseTime = document.getElementById('cruise-time');

cruiseType.addEventListener('change', () => {
  const selected = cruiseType.value;

  // Tylko 08:00
  if (selected === 'Tyniec' || selected === 'Kraków') {
    cruiseTime.value = '08:00';
    cruiseTime.disabled = true;
  }

  // Godzina nie dotyczy
  else if (
    selected === 'Ognisko' ||
    selected === 'Kajaki' ||
    selected === 'Kurs sternika motorowodnego'
  ) {
    cruiseTime.value = '08:00, 10:00, 12:00, 14:00, 16:00, 18:00';
    cruiseTime.disabled = false;
  }

  // Reszta
  else {
    cruiseTime.value = '';
    cruiseTime.disabled = false;
  }
});