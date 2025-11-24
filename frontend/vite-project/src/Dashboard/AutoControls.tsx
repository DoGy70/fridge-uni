import { useState, useEffect } from "react";
import { API } from "../utils/utils";

interface Config {
  target_temperature: number;
  defrost_threshold_temperature: number;
  defrost_type: string;
}

const API_CONFIG_URL = `${API}/config`;

export default function AutoControls() {
  const [config, setConfig] = useState<Config>({
    target_temperature: 4.5,
    defrost_threshold_temperature: -10,
    defrost_type: "AUTO"
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(API_CONFIG_URL);
        const data = await res.json();
        setConfig({...data});
      } catch (err) {
        console.error("Failed to fetch config:", err);
      }
    };
    fetchConfig();
  }, []);

  const updateConfig = async () => {
    console.log(config)
    setSaving(true);
    try {
      const res = await fetch(API_CONFIG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) console.error("Failed to update config");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mt-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Automatic Control Settings</h2>
      <div className="grid">
        <div>
          <label className="block text-gray-700 mb-2">
            Start Compressor Above (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.target_temperature}
            onChange={(e) =>
              {
                setConfig({
                ...config,
                target_temperature: parseFloat(e.target.value),
              })}
            }
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Defrost Start Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.defrost_threshold_temperature}
            onChange={(e) =>
              {
                setConfig({
                ...config,
                defrost_threshold_temperature: parseFloat(e.target.value),
              })}
            }
            className="border p-2 rounded w-full"
          />
        </div>
         <div>
          <label className="block text-gray-700 mb-2">
            Defrost Type
          </label>
          <select value={config.defrost_type} onChange={(e) => setConfig({...config, defrost_type: e.target.value})}>
            <option value="AUTO">Auto</option>
            <option value="FORCED">Forced</option>
          </select>
        </div>
      </div>
      <button
        onClick={updateConfig}
        disabled={saving}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
