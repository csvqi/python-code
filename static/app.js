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
const searchHistorySection = document.getElementById('searchHistorySection');
const searchHistoryContainer = document.getElementById('searchHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const autocompleteSuggestions = document.getElementById('autocompleteSuggestions');

// Popular cities for autocomplete
const POPULAR_CITIES = [
    'London', 'Paris', 'Tokyo', 'New York', 'Sydney', 'Dubai', 'Singapore',
    'Hong Kong', 'Barcelona', 'Amsterdam', 'Rome', 'Berlin', 'Madrid',
    'Los Angeles', 'Chicago', 'Toronto', 'Vancouver', 'Mexico City',
    'Bangkok', 'Istanbul', 'Moscow', 'Cairo', 'Mumbai', 'Delhi',
    'Beijing', 'Shanghai', 'Seoul', 'Bangkok', 'Jakarta', 'Manila',
    'Vienna', 'Prague', 'Warsaw', 'Budapest', 'Athens', 'Dublin',
    'Edinburgh', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki',
    'Istanbul', 'Athens', 'Tel Aviv', 'Dubai', 'Abu Dhabi',
    'Reykjavik', 'Lisbon', 'Porto', 'Milan', 'Venice',
    'Florence', 'Naples', 'Auckland', 'Melbourne', 'Brisbane'
];

// Search history management
const MAX_HISTORY_ITEMS = 10;
const HISTORY_KEY = 'weatherAppSearchHistory';
let autocompleteIndex = -1;

// Load and display history on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplaySearchHistory();
});

// Handle form submission
weatherForm.addEventListener('submit', handleSearch);

// Clear history button
clearHistoryBtn.addEventListener('click', clearSearchHistory);

// Autocomplete event listeners
cityInput.addEventListener('input', handleAutocompleteInput);
cityInput.addEventListener('keydown', handleAutocompleteKeyboard);
document.addEventListener('click', closeAutocompleteOnClickOutside);

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
        
        // Save to search history
        saveSearchToHistory(city);
        loadAndDisplaySearchHistory();

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

// Search history functions
function getSearchHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function saveSearchToHistory(city) {
    let history = getSearchHistory();
    
    // Remove duplicate if it exists (will add at the beginning)
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add new search at the beginning
    history.unshift(city);
    
    // Keep only the last MAX_HISTORY_ITEMS
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadAndDisplaySearchHistory() {
    const history = getSearchHistory();
    
    if (history.length === 0) {
        searchHistorySection.style.display = 'none';
        return;
    }
    
    searchHistorySection.style.display = 'block';
    searchHistoryContainer.innerHTML = '';
    
    history.forEach(city => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'history-item';
        button.textContent = city;
        button.addEventListener('click', () => {
            cityInput.value = city;
            weatherForm.dispatchEvent(new Event('submit'));
        });
        searchHistoryContainer.appendChild(button);
    });
}

function clearSearchHistory() {
    if (confirm('Are you sure you want to clear your search history?')) {
        localStorage.removeItem(HISTORY_KEY);
        searchHistorySection.style.display = 'none';
        searchHistoryContainer.innerHTML = '';
    }
}

// Autocomplete functions
function handleAutocompleteInput(event) {
    const input = event.target.value.trim();
    autocompleteIndex = -1;
    
    if (input.length === 0) {
        closeAutocomplete();
        return;
    }
    
    // Filter cities that start with the input
    const matches = POPULAR_CITIES.filter(city => 
        city.toLowerCase().startsWith(input.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions
    
    if (matches.length === 0) {
        closeAutocomplete();
        return;
    }
    
    displayAutocompleteSuggestions(matches, input);
}

function displayAutocompleteSuggestions(matches, searchTerm) {
    autocompleteSuggestions.innerHTML = '';
    
    matches.forEach(city => {
        const li = document.createElement('li');
        li.className = 'autocomplete-item';
        
        // Highlight matching part
        const index = city.toLowerCase().indexOf(searchTerm.toLowerCase());
        const before = city.substring(0, index);
        const match = city.substring(index, index + searchTerm.length);
        const after = city.substring(index + searchTerm.length);
        
        li.innerHTML = `${before}<strong>${match}</strong>${after}`;
        
        li.addEventListener('click', () => {
            cityInput.value = city;
            closeAutocomplete();
            weatherForm.dispatchEvent(new Event('submit'));
        });
        
        autocompleteSuggestions.appendChild(li);
    });
    
    autocompleteSuggestions.style.display = 'block';
}

function handleAutocompleteKeyboard(event) {
    const items = autocompleteSuggestions.querySelectorAll('.autocomplete-item');
    
    if (items.length === 0) return;
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        autocompleteIndex = (autocompleteIndex + 1) % items.length;
        updateAutocompleteSelection(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        autocompleteIndex = autocompleteIndex - 1 < 0 ? items.length - 1 : autocompleteIndex - 1;
        updateAutocompleteSelection(items);
    } else if (event.key === 'Enter' && autocompleteIndex >= 0) {
        event.preventDefault();
        items[autocompleteIndex].click();
    } else if (event.key === 'Escape') {
        closeAutocomplete();
    }
}

function updateAutocompleteSelection(items) {
    items.forEach((item, index) => {
        if (index === autocompleteIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

function closeAutocomplete() {
    autocompleteSuggestions.style.display = 'none';
    autocompleteSuggestions.innerHTML = '';
    autocompleteIndex = -1;
}

function closeAutocompleteOnClickOutside(event) {
    if (!event.target.closest('.autocomplete-wrapper')) {
        closeAutocomplete();
    }
}

// Optional: Allow search on Enter key in input field (form submission handles this)
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        weatherForm.dispatchEvent(new Event('submit'));
    }
});
