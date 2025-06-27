// Hardcoded weather data
const weatherData = {
  "Ahmdabad": "25°C, Sunny",
  "Nadiad": "18°C, Cloudy",
  "Jamnagar": "35°C, Hot",
  "Dwarka": "22°C, Rainy",
  "Somnath": "20°C, Clear"
};

// Event listener for button click
document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  const resultDiv = document.getElementById('weatherResult');

  if (weatherData[city]) {
    resultDiv.textContent = `Weather in ${city}: ${weatherData[city]}`;
  } else {
    resultDiv.textContent = `Weather data not found for "${city}".`;
  }
});
