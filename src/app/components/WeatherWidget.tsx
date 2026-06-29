import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface WeatherData {
  temp: number;
  code: number;
  city: string;
}

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

export function WeatherWidget() {
  const [lat, setLat] = useLocalStorage<number | null>("steady-weather-lat", null);
  const [lon, setLon] = useLocalStorage<number | null>("steady-weather-lon", null);
  const [city, setCity] = useLocalStorage<string>("steady-weather-city", "");

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  const fetchWeather = async (latitude: number, longitude: number, cityName: string) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
      );
      const data = await res.json();
      setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code, city: cityName });
    } catch { /* silent fail */ }
  };

  useEffect(() => {
    if (lat && lon && city) fetchWeather(lat, lon, city);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detect = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const name = data.address?.city || data.address?.town || data.address?.village || "Your location";
          setLat(latitude); setLon(longitude); setCity(name);
          fetchWeather(latitude, longitude, name);
        } catch {
          setLat(latitude); setLon(longitude); setCity("Your location");
          fetchWeather(latitude, longitude, "Your location");
        } finally {
          setLoading(false);
        }
      },
      () => { setLoading(false); setDenied(true); }
    );
  };

  const boxStyle: React.CSSProperties = {
    backgroundColor: "var(--surface-1)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    margin: "0 12px 12px",
    padding: "10px 12px",
    fontSize: "0.82rem",
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite" style={boxStyle} className="text-muted-foreground">
        Detecting location…
      </div>
    );
  }

  if (denied) return null;

  if (!lat) {
    return (
      <button
        onClick={detect}
        style={{ ...boxStyle, display: "flex", alignItems: "center", gap: 8, width: "calc(100% - 24px)", textAlign: "left", transition: "opacity 0.15s" }}
        className="text-muted-foreground hover:opacity-70"
        aria-label="Add weather forecast"
      >
        <MapPin size={13} style={{ flexShrink: 0 }} />
        Add weather
      </button>
    );
  }

  if (!weather) return null;

  return (
    <div role="status" aria-live="polite" aria-label={`Current weather: ${weather.temp} degrees Celsius, ${weather.city}`} style={boxStyle} className="text-muted-foreground">
      <span aria-hidden="true">{weatherEmoji(weather.code)} </span>
      <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{weather.temp}°C</span>
      {" · "}{weather.city}
    </div>
  );
}
