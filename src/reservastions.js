const reservations = [
  { place: "Tyniec", time: "08:00" },
  { place: "Kraków", time: "08:00" },
  { place: "Kajaki", time: "08:00" },
  { place: "Kursy", time: "08:00" }
];

// ustawiamy godzinę 8:00 tylko dla Tyniec i Kraków
reservations.forEach(res => {
  if(res.place === "Tyniec" || res.place === "Kraków") {
    res.time = "08:00";
  }
});