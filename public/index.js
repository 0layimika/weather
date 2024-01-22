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
document.getElementById('searchForm').addEventListener('submit',function(event){
  event.preventDefault();
  const searchDate = document.getElementById('searchDate').value;
  const formattedDate = formatDate(searchDate);
  axios.get(`/search?date=${formattedDate}`)
  .then(response => {
    const searchResult = response.data;
    displaySearchResult(searchResult);
  })
  .catch(error => {
    console.error('Error:', error.message);
    document.getElementById('searchResult').innerText='Error searching for weather data.';

  });
});
function displaySearchResult(weatherData){
  const searchResultDiv = document.getElementById('searchResult');

  if(weatherData){
    searchResultDiv.innerHTML = `
    <h3>Weather Data for ${weatherData.location} on ${weatherData.date}</h3>
    <p>Temperature: ${weatherData.temperature}°</p>
    <p>Description: ${weatherData.description}</p>`;
  } else{
    searchResultDiv.innerText = 'Weather data not found for the specified date.'
  }
}
function formatDate(date){
  const inputDate = new Date(date);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}