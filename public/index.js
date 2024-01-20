function search() {
  const locationToSearch = document.getElementById("location").value;

  axios.post('/weather', { location: locationToSearch })
    .then(response => {
      const weatherData = response.data;
      console.log('Weather:', weatherData);
      document.getElementById('degree').innerText = `${weatherData.main.temp}º`;
      document.getElementById('description').innerText = weatherData.weather[0].description;
      document.getElementById('current-location').innerText = locationToSearch;
        const weatherImg = document.getElementById('weather-img');
      weatherImg.src = getWeatherIcon(weatherData.weather[0].icon);
      function getWeatherIcon(iconCode) {
        if (iconCode === '01d') return 'img/sunny.svg';
        else if (iconCode === '02d') return 'img/partly_cloudy.svg';
          else return 'img/default_weather_icon.svg';
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}
