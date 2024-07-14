document.addEventListener("DOMContentLoaded", () => {
  // weather api key
  const apiKey = "31009f88c1ad46bb6c764e1bfd130082";
  let searchBtn = document.querySelector(".search-btn");
  let currentLocationBtn = document.querySelector(".current-location-btn");
  let cityInput = document.querySelector(".input-search");
  let city = document.getElementById("city-name");

  // function to update day,time..
  function updateTime() {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = days[now.getDay()];
    const date = now.getDate().toString().padStart(2, "0");
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours} :${minutes}`;
    //   console.log(time);
    document.getElementById("time").textContent = time;
    document.getElementById(
      "day"
    ).textContent = `${day}, ${date} ${month} ${year}`;
  }

  setInterval(updateTime, 60000);
  updateTime(); // Initial call to display time immediately

  getCoordinates("Delhi"); // Initial call to display weather Details oF Delhi

  // searchBtn event listener
  searchBtn.addEventListener("click", () => {
    let cityName = cityInput.value;
    city.innerText = cityInput.value.toUpperCase();
    cityInput.value = "";
    // console.log(cityName);

    getCoordinates(cityName);
  });

  // currentLocationBtn event listener
  currentLocationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(lat, lon);
    });
  });

  async function getCoordinates(cityName) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},+91&limit=1&appid=${apiKey}`;
    try {
      let response = await axios.get(url);
      let lon = response.data[0].lon;
      let lat = response.data[0].lat;
      fetchWeatherData(lat, lon);
    } catch (error) {
      if (error.response) {
        console.error(
          `Error fetching Coordinates data: ${error.response.statusText}`
        );
      } else {
        console.error("Error fetching Coordinates data");
      }
    }
  }

  async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
      let response = await axios.get(url);
      // console.log(response.data);
      processWeatherData(response);
    } catch (error) {
      if (error.response) {
        console.error(
          `Error fetching weather data: ${error.response.statusText}`
        );
      } else {
        console.error("Error fetching weather data");
      }
    }
  }

  // process weather function
  function processWeatherData(response) {
    let value = response.data.name.toUpperCase();
    // console.log(value);
    city.innerText = value;
    document.getElementById(
      "temp"
    ).textContent = `${response.data.main.temp}°C`;

    document.getElementById(
      "feels-like"
    ).textContent = `Feels like: ${response.data.main.feels_like}°C`;

    document.getElementById(
      "humidity"
    ).textContent = `${response.data.main.humidity}%`;

    document.getElementById(
      "pressure"
    ).textContent = `${response.data.main.pressure}hPa`;

    document.getElementById(
      "wind-speed"
    ).textContent = `${response.data.wind.speed}m/s`;

    document.getElementById(
      "description"
    ).textContent = `${response.data.weather[0].description}`;

    // sunrise and sunset time conversions

    let unixSunsetTime = response.data.sys.sunset;
    let unixSunriseTime = response.data.sys.sunrise;
    console.log("Unix sunset time : ", unixSunsetTime);

    let sunsetTime = unixConvert(unixSunsetTime);
    let sunriseTime = unixConvert(unixSunriseTime);
    console.log("Sunset time:", sunsetTime);

    document.getElementById(
      "sunset"
    ).innerHTML = `<p>Sunset <br> ${sunsetTime}</p>`;

    document.getElementById(
      "sunrise"
    ).innerHTML = `<p>Sunrise <br> ${sunriseTime}</p>`;
  }

  // unix converter
  function unixConvert(value) {
    let dateObject = new Date(value * 1000);

    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();

    let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedTime;
  }
});
