const APIkey = "d77dd3a350b3fe5cdc671210cf41ca6b";
let units = "imperial";
const selectUnits = document.getElementById("selectUnits");
const btnMyLocation = document.getElementById("btnMyLocation");
const btnSearch = document.getElementById("btnSearch");

function getCityCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      showLocation(response);
      const { lat, lon } = response.coord;
      getCity5DaysForecats(lat, lon);
    });
}
function getLocationCurrentWeather(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      showLocation(response);
      const { lat, lon } = response.coord;
      getCity5DaysForecats(lat, lon);
    });
}

function getCity5DaysForecats(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      showWeatherInformation(response);
    });
}

function getMyLocationWeather(position) {
  getLocationCurrentWeather(
    position.coords.latitude,
    position.coords.longitude
  );
}

function errorLocation(err) {
  alert(`ERROR(${err.code}): ${err.message}`);
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function showLocation(info) {
  console.log(info);
  var date = moment(info.dt * 1000);
  console.log(date);
  const cityName = document.getElementById("cityName");
  const weatherIcon = document.getElementById("weatherIcon");

  cityName.textContent = `${info.name} - ${date.format("MM/DD/YYYY")}`;

  const iconUrl = `http://openweathermap.org/img/w/${info.weather[0].icon}.png`;
  weatherIcon.setAttribute("src", iconUrl);
}

function showWeatherInformation(info) {
  console.log(info);
  const temperature = document.getElementById("temperature");
  const wind = document.getElementById("wind");
  const humidity = document.getElementById("humidity");
  const uvIndex = document.getElementById("uvIndex");
  const unit = units == "imperial" ? "F" : "C";

  formatUVIndex(info.current.uvi);

  temperature.textContent = `Temperature: ${info.current.temp} ${unit}`;
  wind.textContent = `Wind: ${info.current.wind_speed} ${
    unit === "F" ? "MPH" : "KMH"
  }`;
  humidity.textContent = `Humidity: ${info.current.humidity}%`;
  uvIndex.innerHTML = formatUVIndex(info.current.uvi);
}

function formatUVIndex(uvi) {
  if (uvi < 3) {
    return `<span class="badge uvi-low">${uvi} - Low <i>No Protection Required</i></span>`;
  } else if (uvi >= 3 && uvi <= 5) {
    return `<span class="badge uvi-moderate">${uvi} - Moderate <i>Protection Required</i></span>`;
  } else if (uvi >= 6 && uvi <= 7) {
    return `<span class="badge uvi-high">${uvi} - High <i>Protection Required</i></span>`;
  } else if (uvi >= 8 && uvi < 11) {
    return `<span class="badge uvi-very-high">${uvi} - Very High <i>Protection Required</i></span>`;
  } else if (uvi >= 11) {
    return `<span class="badge uvi-extreme">${uvi} - Extreme <i>Extra Protection Required</i></span>`;
  }
}

selectUnits.addEventListener("change", () => {
  units = selectUnits.value;
});

btnMyLocation.addEventListener("click", (event) => {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getMyLocationWeather, errorLocation);
});

btnSearch.addEventListener("click", (event) => {
  const inputCity = document.getElementById("inputCity");
  event.preventDefault();
  getCityCurrentWeather(inputCity.value);
});
