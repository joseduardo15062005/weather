const APIkey = "d77dd3a350b3fe5cdc671210cf41ca6b";
let units = "imperial";
const selectUnits = document.getElementById("selectUnits");
const btnMyLocation = document.getElementById("btnMyLocation");
const btnSearch = document.getElementById("btnSearch");
const forecastContainer = document.getElementById("forecast-container");
const cardBodyHistory = document.getElementById("cardBodyHistory");
const divWeather = document.getElementById("divWeather");

divWeather.style.display = "none";

getSearchHistory();

//get city weather from the city name
function getCityCurrentWeather(city) {
  if (city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIkey}`;
    fetch(apiUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          showLocation(response);
          const { lat, lon } = response.coord;
          getCity5DaysForecast(lat, lon);
        } else {
          Swal.fire({
            icon: "error",
            title: "City Not Found",
            text: `The system can't find the city ${city}, please review and try again`,
            confirmButtonColor: "#3085d6",
          });
          inputCity.focus();
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "Please type a city name",
      text: `Type a city name.`,
      confirmButtonColor: "#3085d6",
    });
    inputCity.focus();
  }
}

//Get City Weather using coordinates
function getLocationCurrentWeather(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      showLocation(response);
      const { lat, lon } = response.coord;
      getCity5DaysForecast(lat, lon);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Get City Forecast
function getCity5DaysForecast(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${APIkey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      showWeatherInformation(response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Get User Location
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

//Show information about the Current Forecast and City Name
function showLocation(info) {
  var date = moment(info.dt * 1000);
  const cityName = document.getElementById("cityName");
  const weatherIcon = document.getElementById("weatherIcon");
  cityName.textContent = `${info.name} - ${date.format("MM/DD/YYYY")}`;
  const iconUrl = `http://openweathermap.org/img/w/${info.weather[0].icon}.png`;
  weatherIcon.setAttribute("src", iconUrl);
  //Save City in localStorage
  saveSearchHistory(info.name);
  divWeather.style.display = "block";
}

//Show aditional information about the weather and forecast
function showWeatherInformation(info) {
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

  showDailyForecast(info.daily);
}

//Show Daily forecast (5 Days) in forecast-container
function showDailyForecast(forecast) {
  forecastContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    forecastContainer.innerHTML += createForecastDiv(forecast[i]);
  }
}

//Create each div for each forecast
function createForecastDiv(dayForecast) {
  const date = moment(dayForecast.dt * 1000);
  const icon = `http://openweathermap.org/img/w/${dayForecast.weather[0].icon}.png`;
  const iconAlt = dayForecast.weather[0].description;
  const temp = dayForecast.temp.day;
  const tempMax = dayForecast.temp.max;
  const tempMin = dayForecast.temp.min;
  const wind = dayForecast.temp.day;
  const humidity = dayForecast.humidity;
  const uvi = formatUVIndex(dayForecast.uvi);

  const forecastHtml = `
                <div class="card forecast-card mx-1">
                <div class="card-body">
                <h2>${date.format("MM/DD/YYYY")}</h2>
                <img src="${icon}" alt="${iconAlt}"/>
                <p>Temp:${temp}</p>
                <p>Wind:${wind}</p>
                <p>Humidity:${humidity} %</p>
                <p>UV Index:${uvi}</p>
                </div>
              `;
  return forecastHtml;
}

//Add Color Formating to the UV Index
function formatUVIndex(uvi) {
  if (uvi < 3) {
    return `<span class="badge uvi-low">${uvi} - Low <i>No Protection Required</i></span>`;
  } else if (uvi >= 3 && uvi < 6) {
    return `<span class="badge uvi-moderate">${uvi} - Moderate <i>Protection Required</i></span>`;
  } else if (uvi >= 6 && uvi < 8) {
    return `<span class="badge uvi-high">${uvi} - High <i>Protection Required</i></span>`;
  } else if (uvi >= 8 && uvi < 11) {
    return `<span class="badge uvi-very-high">${uvi} - Very High <i>Protection Required</i></span>`;
  } else if (uvi >= 11) {
    return `<span class="badge uvi-extreme">${uvi} - Extreme <i>Extra Protection Required</i></span>`;
  }
}

//Save City in the locaStorage History
function saveSearchHistory(city) {
  const history = JSON.parse(localStorage.getItem("cities"));
  let cities = [];
  if (!history) {
    //Initialize the array;
    cities.push(city);
  } else {
    if (!history.find((c) => c === city)) {
      cities = [...history, city];
    } else {
      cities = [...history];
    }
  }
  localStorage.setItem("cities", JSON.stringify(cities));
  getSearchHistory();
}
//Get city to search history
function getSearchHistory() {
  //Get search history from localStorage
  const history = JSON.parse(localStorage.getItem("cities"));
  if (history) {
    //Show history in CardBodyHistory
    cardBodyHistory.innerHTML = "";
    for (let city of history) {
      cardBodyHistory.innerHTML += `<button class="btn btn-primary" data-city="${city}">
                                  ${city}
                                  </button>`;
    }
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

cardBodyHistory.addEventListener("click", (event) => {
  city = event.target.getAttribute("data-city");
  getCityCurrentWeather(city);
});

//Using google autocomplete API
let autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("inputCity"),
    {
      types: ["(cities)"],
      componentRestrictions: {
        country: "us",
      },
    }
  );
  autocomplete.addListener("place_changed", onCityChanged);
}
//Get City Weather Information
function onCityChanged() {
  var place = autocomplete.getPlace();
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  getLocationCurrentWeather(lat, lng);
}
