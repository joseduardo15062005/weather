const APIkey = "d77dd3a350b3fe5cdc671210cf41ca6b";

let units = "imperial";
const selectUnits = document.getElementById("selectUnits");
const btnMyLocation = document.getElementById("btnMyLocation");

getCityCurrentWeather("Las Vegas");

function getCityCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      const { lat, lon } = response.coord;
      getCity5DaysForecats(lat, lon);
    });
}

function getCity5DaysForecats(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => console.log("Forecast 5 Days", response));
}

function getMyLocationWeather(position) {
  console.log(position);
}

selectUnits.addEventListener("change", () => {
  units = selectUnits.value;
});

btnMyLocation.addEventListener("click", (event) => {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getMyLocationWeather);
});
