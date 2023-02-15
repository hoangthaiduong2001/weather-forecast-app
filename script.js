const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const country = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const api = {
  key: "e7704bc895b4a8d2dfd4a29d404285b6",
  baseCurrentWeather: "https://api.openweathermap.org/data/2.5/weather?",
  baseForecast: "https://api.openweathermap.org/data/2.5/forecast?",
  units: "metric",
};

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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

const search = document.querySelector(".search-box");
search.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getWeatherData(search.value);
  }
}

function getWeatherData(response) {
  fetch(
    `${api.baseCurrentWeather}q=${response}&appid=${api.key}&units=${api.units}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showWeatherData(data);
    })
    .catch((erro) => {
      alert("error!! " + erro);
    });
  fetch(`${api.baseForecast}q=${response}&appid=${api.key}&units=${api.units}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showForecastData(data);
      getForecastData(data);
    })
    .catch((erro) => {
      alert("error!! " + erro);
    });
}

function showWeatherData(data) {
  country.innerHTML = data.name;
  if(data){
    currentWeatherItemsEl.style.display = 'block'
    currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <div>Humidity</div>
        <div>${data.main.humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${data.main.pressure}</div>
    </div>
    <div class="weather-item">
        <div>Temperature</div>
        <div>${data.main.temp}</div>
    </div>
    <div class="weather-item">
        <div>Wind</div>
        <div>${data.wind.speed} Km/h</div>
    </div>
    `;
  } else{
    currentWeatherItemsEl.style.display = 'none'
  }
}

function showForecastData(data) {
  console.log(data);
  let otherDayForcast = "";
  data.list.forEach((day, i) => {
    if (i === 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format("dddd")}</div>
                <div>${window.moment(day.dt_txt).format('DD/MM')} </div>
                <div class="temp">${day.weather[0].main} - ${day.main.temp}°C</div>
            </div>     
            `;         
    } else if( i === 8 || i === 16 || i === 24 || i === 32 || i === 40){
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon">
                <div>${window.moment(day.dt_txt).format('DD/MM')}</div>
                <div class="temp">${day.weather[0].main} - ${day.main.temp}°C</div>
            </div>        
            `;
    }
  });
  weatherForecastEl.innerHTML = otherDayForcast;
}

function getForecastData(data) {
  weatherForecastEl.addEventListener("click", function () {
   data.list.forEach((day, i) => {
    if(i === 0 || i === 8 || i === 16 || i === 24 || i === 32 || i === 40){
      console.log(data)
      currentWeatherItemsEl.innerHTML = `
      <div class="weather-item">
          <div>Humidity</div>
          <div>${day.main.humidity}%</div>
      </div>
      <div class="weather-item">
          <div>Pressure</div>
          <div>${day.main.pressure}</div>
      </div>
      <div class="weather-item">
          <div>Temperature</div>
          <div>${day.main.temp}</div>
      </div>
      <div class="weather-item">
          <div>Wind</div>
          <div>${day.wind.speed} Km/h</div> 
      </div>
      `;
    }
   })
  });
}
