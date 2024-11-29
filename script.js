const city_input = document.getElementById("city");
const search_button = document.getElementById("search-btn");
const city_label = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weather_desc = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");

async function fetchWeatherData(city_name) {
    const api_key = "1af66cd5abc643bb804205450242611";  // Your API Key
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city_name}&aqi=yes`; // API request URL

    try {
        const response = await fetch(url);

        // Check if the response is successful (status 200-299)
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();  // Parse the JSON response
        return data;
    } catch (error) {
        console.error(error);  // Log the error to the console
        return null;  // Return null if there’s an error
    }
}

async function setDefaultValues() {
    const city_name = city_input.value;

    // Set default empty values
    if (city_label) city_label.innerText = "";
    if (temperature) temperature.innerText = "Temperature: --";
    if (weather_desc) weather_desc.innerText = "Weather: --";
    if (humidity) humidity.innerText = "Humidity: --";
    if (wind_speed) wind_speed.innerText = "Wind Speed: --";

    // Reset background to default clear state before making the API call
    document.body.classList.remove("sunny", "rainy", "cloudy", "snowy");
    document.body.classList.add("clear");  // Default background

    if (city_name) {
        const weatherData = await fetchWeatherData(city_name);

        if (weatherData) {
            const temperatureValue = weatherData.current.temp_c; // Temperature in Celsius
            const humidityValue = weatherData.current.humidity; // Humidity
            const windSpeedValue = weatherData.current.wind_kph; // Wind speed in kph
            const weatherDescription = weatherData.current.condition.text; // Weather description (e.g. "Partly cloudy")

            // Update the UI elements with the fetched data
            if (city_label) city_label.innerText = city_name;
            if (temperature) temperature.innerText = `Temperature: ${temperatureValue}°C`;
            if (weather_desc) weather_desc.innerText = `Weather: ${weatherDescription}`;
            if (humidity) humidity.innerText = `Humidity: ${humidityValue}%`;
            if (wind_speed) wind_speed.innerText = `Wind Speed: ${windSpeedValue} km/h`;

            // Update the style based on the weather description
            updateWeatherStyle(weatherDescription);
        } else {
            // If no weather data is found, display "City not found"
            if (city_label) city_label.innerText = "City not found";
        }
    }
}

function updateWeatherStyle(weather) {
    // Remove all weather-related background classes
    document.body.classList.remove("clear", "sunny", "rainy", "cloudy", "snowy","default");

    if (!weather) {
        return; // No style update if weather is empty
    }

    // Add a class based on the weather description
    if (weather.toLowerCase().includes("clear")) {
        document.body.classList.add("clear");
    } else if (weather.toLowerCase().includes("sun")) {
        document.body.classList.add("sunny");
    } else if (weather.toLowerCase().includes("rain")|| weather.toLowerCase().includes("drizzle")) {
        document.body.classList.add("rainy");
    } else if (weather.toLowerCase().includes("cloud")|| weather.toLowerCase().includes("overcast")) {
        document.body.classList.add("cloudy");
    }  else if (weather.includes("Partly cloudy")) {
        document.body.classList.add("cloudy");
    } else if (weather.toLowerCase().includes("snow") || weather.toLowerCase().includes("blizzard")) {
        document.body.classList.add("snowy");
    } else if (weather.toLowerCase().includes("fog") || weather.toLowerCase().includes("mist")) {
        document.body.classList.add("fog"); 
    } else {
        document.body.classList.add("default"); // Default background
    }
}

if (search_button) {
    search_button.addEventListener("click", setDefaultValues);
}

if (city_input) {
    city_input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            setDefaultValues();
        }
    });
}
