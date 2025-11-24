  import { useEffect, useState } from "react";
  import SensorDisplay from "./Dashboard/SensorDisplay";
  import ModeSwitcher from "./Dashboard/ModeSwitcher";
  import AutoControls from "./Dashboard/AutoControls";
  import { API } from "./utils/utils";

  type RelayState = {
    compressor_on: number;
    ventilation_on: number;
    heater_on: number;
    timestamp: number;
    mode: string;
  };

  function App() {
    const [relays, setRelays] = useState<RelayState>({
      compressor_on: 1,
      ventilation_on: 1,
      heater_on: 1,
      timestamp: 0,
      mode: 'manual'
    });

    const [mode, setMode] = useState<"manual" | "auto">("manual");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      async function fetchRelaysStates() {
        try {
          const response = await fetch(`${API}/relay-state`)

          if(!response.ok) throw new Error("There was an error fetching the relay states")

          const newState = await response.json()
          setRelays(() => {
            return newState
          })

        } catch (error) {
          console.error("Error getting relay data: ", error)
        }
      }

      fetchRelaysStates()
    }, [mode])

    const toggleRelay = async (relayKey: keyof RelayState) => {
      const newState: RelayState = {
        ...relays,
        [relayKey]: !relays[relayKey],
        timestamp: new Date().valueOf(),
        mode: 'manual'
      };
      setRelays((oldState) => {return {...newState}});
      
      try {
    
        const response = await fetch(`${API}/relay-state`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newState),
        });
        if (!response.ok) console.error("Failed to send relay state");
      } catch (error) {
        console.error("Error sending relay data:", error);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold mb-4">Fridge Control Dashboard</h1>

        <ModeSwitcher mode={mode} setMode={setMode} setIsLoading={setIsLoading} />

        <SensorDisplay />

        {mode === "manual" ? (
          <div className="flex gap-6 mt-4">
            {Object.keys(relays).map((relayKey, idx) => {
              const key = relayKey as keyof RelayState;
              if (!key.endsWith('on')) return
              
              const isOn = relays[key];
              return (
                <button
                  disabled={isLoading}
                  key={relayKey}
                  onClick={() => toggleRelay(key)}
                  className={`w-32 h-32 rounded-full shadow-md border-2 border-gray-400 transition-all duration-200 text-lg font-semibold 
                    ${ isOn ? "bg-red-500 text-white" : "bg-white text-gray-800"}
                    ${ isLoading ? "bg-gray-200 text-black opacity-50" : ""}`}
                >
                  {relayKey.split("_")[0]}
                </button>
              );
            })}
          </div>
        ) : (
          <AutoControls />
        )}
      </div>
    );

  }

  export default App;