export const  enviroment = {
  api: 'https://gestogricola.kesug.com/api',
  api_clima: 'https://api.open-meteo.com/v1/forecast?',
  api_clima2: '&current=temperature_2m,wind_speed_10m,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode'
}


// weather-codes.ts
export const WEATHER_CODES: Record<number, { text: string, icon: string }> = {
  0:  { text: 'Cielo despejado', icon: '☀️' },
  1:  { text: 'Mayormente soleado', icon: '🌤️' },
  2:  { text: 'Parcialmente nublado', icon: '⛅' },
  3:  { text: 'Nublado', icon: '☁️' },
  45: { text: 'Niebla', icon: '🌫️' },
  48: { text: 'Neblina', icon: '🌫️' },
  51: { text: 'Llovizna ligera', icon: '🌦️' },
  53: { text: 'Llovizna moderada', icon: '🌧️' },
  55: { text: 'Llovizna intensa', icon: '🌧️' },
  61: { text: 'Lluvia ligera', icon: '🌦️' },
  63: { text: 'Lluvia moderada', icon: '🌧️' },
  65: { text: 'Lluvia intensa', icon: '🌧️' },
  71: { text: 'Nieve ligera', icon: '🌨️' },
  73: { text: 'Nieve moderada', icon: '❄️' },
  75: { text: 'Nieve intensa', icon: '❄️' },
  95: { text: 'Tormenta eléctrica', icon: '⚡' },
  96: { text: 'Tormenta con granizo', icon: '🌩️' },
  99: { text: 'Tormenta severa con granizo', icon: '🌩️' }
};
