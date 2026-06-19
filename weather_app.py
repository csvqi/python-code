from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
API_KEY = os.getenv('OPENWEATHER_API_KEY')
OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

# Debug: Print if API key is loaded
if API_KEY:
    print(f"✓ API Key loaded: {API_KEY[:10]}..." if len(API_KEY) > 10 else f"✓ API Key loaded")
else:
    print("✗ Warning: No API key found in .env file")


@app.route('/')
def index():
    """Render the main weather app page."""
    return render_template('index.html')


@app.route('/api/weather', methods=['POST'])
def get_weather():
    """
    Fetch weather data for a given city.
    Expected JSON: {"city": "London"}
    Returns weather data or error message.
    """
    try:
        data = request.get_json()
        city = data.get('city', '').strip()
        
        if not city:
            return jsonify({'error': 'City name is required'}), 400
        
        if not API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
        
        # Call OpenWeatherMap API
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(OPENWEATHER_URL, params=params, timeout=5)
        
        if response.status_code == 404:
            return jsonify({'error': f'City "{city}" not found'}), 404
        elif response.status_code == 401:
            print(f"✗ API Error 401: {response.text}")
            return jsonify({'error': 'Invalid API key. Please check your OpenWeatherMap API key.'}), 401
        elif response.status_code != 200:
            print(f"✗ API Error {response.status_code}: {response.text}")
            return jsonify({'error': f'Weather service error ({response.status_code})'}), 500
        
        weather_data = response.json()
        
        # Extract relevant weather information
        result = {
            'city': weather_data['name'],
            'country': weather_data['sys'].get('country', ''),
            'temperature': round(weather_data['main']['temp'], 1),
            'feels_like': round(weather_data['main']['feels_like'], 1),
            'condition': weather_data['weather'][0]['main'],
            'description': weather_data['weather'][0]['description'].capitalize(),
            'icon': f"https://openweathermap.org/img/wn/{weather_data['weather'][0]['icon']}@2x.png",
            'humidity': weather_data['main']['humidity'],
            'wind_speed': round(weather_data['wind']['speed'], 1),
            'pressure': weather_data['main']['pressure']
        }
        
        return jsonify(result), 200
    
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Network error. Please try again.'}), 500
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
