// Debounce function to prevent rapid API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// DOM elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherDisplay = document.getElementById('weatherDisplay');
const welcomeMessage = document.getElementById('welcomeMessage');

// Handle form submission
weatherForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    fetchWeather(city);
}

async function fetchWeather(city) {
    try {
        // Clear previous state
        clearError();
        hideWeatherDisplay();
        showLoadingSpinner();

        // Fetch weather data from backend
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Unable to fetch weather data');
            hideLoadingSpinner();
            return;
        }

        // Display weather data
        displayWeather(data);
        hideLoadingSpinner();
        hideWelcomeMessage();

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Network error. Please try again.');
        hideLoadingSpinner();
    }
}

function displayWeather(data) {
    // Populate weather data into the DOM
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('countryCode').textContent = data.country;
    document.getElementById('temperature').textContent = data.temperature;
    document.getElementById('condition').textContent = data.condition;
    document.getElementById('description').textContent = data.description;
    document.getElementById('feelsLike').textContent = data.feels_like;
    document.getElementById('humidity').textContent = data.humidity;
    document.getElementById('windSpeed').textContent = data.wind_speed;
    document.getElementById('pressure').textContent = data.pressure;

    // Set weather icon with fallback emoji
    const iconImg = document.getElementById('weatherIcon');
    iconImg.src = data.icon;
    iconImg.onerror = () => {
        iconImg.style.display = 'none';
    };

    // Show weather display
    weatherDisplay.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

function hideWeatherDisplay() {
    weatherDisplay.style.display = 'none';
}

function showLoadingSpinner() {
    loadingSpinner.style.display = 'flex';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

function hideWelcomeMessage() {
    welcomeMessage.style.display = 'none';
}

// Optional: Allow search on Enter key in input field (form submission handles this)
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        weatherForm.dispatchEvent(new Event('submit'));
    }
});
