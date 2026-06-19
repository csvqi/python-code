# Weather App

A beautiful, responsive Flask web application that displays current weather information for any city. Built with Flask backend and vanilla JavaScript frontend.

## Features

✨ **Current Weather Display**
- Enter any city name to get real-time weather data
- View temperature, condition, and weather icon
- See "feels like" temperature, humidity, wind speed, and pressure
- Responsive design works perfectly on mobile and desktop

🎨 **User Experience**
- Clean, modern UI with smooth animations
- Loading spinner during API calls
- Clear error messages for invalid cities
- Real-time weather icons from OpenWeatherMap

🔒 **Secure**
- API key stored in `.env` file (never committed to git)
- `.gitignore` protects sensitive data

## Tech Stack

- **Backend:** Flask (Python web framework)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Weather API:** OpenWeatherMap (free tier)
- **Dependencies:** Flask, Requests, Python-dotenv

## Project Structure

```
e:\python code\
├── weather_app.py          # Flask application with API endpoints
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (API key) - NOT tracked by git
├── .env.example            # Template for .env file
├── .gitignore              # Git ignore rules (protects secrets)
├── README.md               # This file
├── templates/
│   └── index.html          # Main HTML template
└── static/
    ├── app.js              # JavaScript logic for weather fetching
    └── style.css           # Responsive styling
```

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- OpenWeatherMap API key (free - see setup instructions below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/csvqi/python-code.git
   cd python-code
   ```

2. **Create and activate a virtual environment (optional but recommended)**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Get an OpenWeatherMap API Key**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Go to your API keys section
   - Copy your default API key
   - **Note:** New API keys may take a few minutes to activate

5. **Set up environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env    # Windows
     cp .env.example .env      # macOS/Linux
     ```
   - Open `.env` in your text editor
   - Replace the empty value with your OpenWeatherMap API key:
     ```
     OPENWEATHER_API_KEY=your_actual_api_key_here
     ```

6. **Run the application**
   ```bash
   python weather_app.py
   ```

7. **Open in browser**
   - Navigate to `http://localhost:5000`
   - Enter a city name and click "Search"

## Usage

1. **Search for a city:**
   - Type a city name in the search box (e.g., "London", "New York", "Tokyo")
   - Click the "Search" button or press Enter
   
2. **View weather information:**
   - Current temperature in Celsius
   - Weather condition (Cloudy, Rainy, Sunny, etc.)
   - Weather icon
   - "Feels like" temperature
   - Humidity percentage
   - Wind speed in m/s
   - Atmospheric pressure in hPa

3. **Error handling:**
   - If city is not found, you'll see an error message
   - Invalid API key will show a clear error
   - Network timeouts are handled gracefully

## API Endpoints

### GET `/`
Serves the main weather app HTML interface.

### POST `/api/weather`
Fetches weather data for a given city.

**Request:**
```json
{
  "city": "London"
}
```

**Response (Success - 200):**
```json
{
  "city": "London",
  "country": "GB",
  "temperature": 15.2,
  "feels_like": 14.8,
  "condition": "Cloudy",
  "description": "Overcast clouds",
  "icon": "https://openweathermap.org/img/wn/04d@2x.png",
  "humidity": 72,
  "wind_speed": 4.5,
  "pressure": 1013
}
```

**Response (Error - 404):**
```json
{
  "error": "City \"xyz\" not found"
}
```

## Environment Variables

Create a `.env` file in the project root:

```
OPENWEATHER_API_KEY=your_api_key_here
```

⚠️ **Important:** Never commit `.env` to git! The `.gitignore` file already protects it.

## Dependencies

See `requirements.txt` for all dependencies:
- `flask==2.3.3` - Web framework
- `requests==2.31.0` - HTTP library for API calls
- `python-dotenv==1.0.0` - Environment variable management

Install all with:
```bash
pip install -r requirements.txt
```

## Troubleshooting

### "Invalid API key" Error
- Verify your API key is correct in `.env`
- Check if your OpenWeatherMap account has activated the API key (may take a few minutes)
- Try generating a new API key from OpenWeatherMap dashboard

### "City not found" Error
- Check spelling of the city name
- Try with the country code, e.g., "London, GB"

### Template not found Error
- Ensure `templates/` folder exists in the project root
- Verify `index.html` is in the `templates/` folder

### Port already in use Error
- The default port is 5000. If occupied, modify `weather_app.py`:
  ```python
  app.run(debug=True, port=5001)  # Change to any available port
  ```

## Development

To enable hot reload during development:
```bash
python weather_app.py
```

The app runs with `debug=True` by default, so changes will auto-reload the server.

## Deployment

For production deployment:
1. Set `debug=False` in `weather_app.py`
2. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 weather_app:app
   ```
3. Set environment variables on your deployment platform
4. Consider using a reverse proxy like Nginx

## Security Notes

- 🔐 Never commit `.env` file with real API keys to git
- 🔐 Use `.env.example` to document required variables
- 🔐 Regenerate API keys if accidentally exposed
- 🔐 Use HTTPS in production
- 🔐 Add rate limiting for production

## Future Enhancements

- [ ] Multi-day forecast
- [ ] Geolocation-based weather
- [ ] Weather alerts
- [ ] Dark mode toggle
- [ ] Search history
- [ ] Multiple language support
- [ ] Caching for offline access

## Contributing

Feel free to fork and submit pull requests for any improvements!

## License

This project is open source and available under the MIT License.

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify your OpenWeatherMap API key is valid
3. Ensure all dependencies are installed: `pip install -r requirements.txt`
4. Check that `.env` file exists with your API key

## Author

Created as a Flask weather application project.

## Changelog

### v1.0 (2026-06-20)
- Initial release
- Flask backend with OpenWeatherMap integration
- Responsive frontend with real-time weather display
- Error handling and loading states
- Mobile-friendly design
