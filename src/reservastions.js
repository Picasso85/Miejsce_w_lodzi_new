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
    cruiseTime.value = '';
    cruiseTime.disabled = true;
  }

  // Reszta
  else {
    cruiseTime.value = '';
    cruiseTime.disabled = false;
  }
});