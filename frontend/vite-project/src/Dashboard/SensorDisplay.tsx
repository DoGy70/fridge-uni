import { useState, useEffect } from "react";
import { API } from "../utils/utils";

interface SensorData {
  humidity: number;
  temperature: number;
  evaporator_temperature: number;
}

function SesnsorDisplay() {
  const [sensors, setSensors] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${API}/sensors`;

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Failed to fetch sensors: ${res.status}`);
        const data: SensorData = await res.json();
        setSensors({humidity: data.humidity, temperature: data.temperature, evaporator_temperature: data.evaporator_temperature});
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSensors(); // fetch immediately
    const interval = setInterval(fetchSensors, 60000); // then every 1 min
    return () => clearInterval(interval); // cleanup
  }, []);
    
    // if (error) return <div className="text-red-500">Error: {error}</div>

    //if(!sensors) return <div>Loading...</div>

    return (
    <div className="grid max-sm:grid-cols-2 grid-cols-3 gap-6 bg-white rounded-2xl shadow-md px-6 py-8 w-full max-w-4xl">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-700">Humidity</h2>
        <p className="text-3xl font-bold text-blue-500">
          {sensors?.humidity?.toFixed(1) || 0}%
        </p>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-700">Temperature (Area)</h2>
        <p className="text-3xl font- bold text-orange-500">
          {sensors?.temperature?.toFixed(1) || 0}°C
        </p>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-700">Temperature (Fridge)</h2>
        <p className="text-3xl font-bold text-green-600">
          {sensors?.evaporator_temperature?.toFixed(1) || 0}°C
        </p>
      </div>
      
    </div>
  );
}
export default SesnsorDisplay;
