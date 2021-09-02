const APIkey = "d77dd3a350b3fe5cdc671210cf41ca6b";
const unitsImperial = "imperial";
const unitsmMtric = "metric";

getCityCurrentWeather("Las Vegas");

function getCityCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unitsImperial}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      const { lat, lon } = response.coord;
      getCity5DaysForecats(lat, lon);
    });
}

function getCity5DaysForecats(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unitsImperial}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => console.log("Forecast 5 Days", response));
}
