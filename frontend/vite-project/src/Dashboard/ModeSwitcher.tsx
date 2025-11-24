import { useState, useEffect } from "react";
import { API } from "../utils/utils";

interface AdminResponse {
  admin: true | false;
}

const API_MODE_URL = `${API}/mode`
console.log(API_MODE_URL)
const API_ADMIN_URL = `${API}/admin`

export default function ModeSwitcher({
  mode,
  setMode,
  setIsLoading
}: {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"auto" | "manual">>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<true | false>(false);

  // Sync mode from server on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(API_ADMIN_URL);
        const data: AdminResponse = await res.json();

        if(data) {
          if (data.admin === false) setMode('auto')
          setIsAdmin(data.admin)
        };

      } catch (err) {
        console.error("Error fetching mode:", err);
      }
    };
    let interval
    if (!isAdmin){
      interval = setInterval(fetchAdmin, 2000)
    } else {
      interval = setInterval(fetchAdmin, 300000)
     } // then every 1 min
   return () => clearInterval(interval); // cleanup
 }, [isAdmin]);

  const toggleMode = async () => {
    const newMode = mode === "manual" ? "auto" : "manual";
    setLoading(true);
    if (newMode === 'auto'){
      setIsLoading(true);
    }
    try {
      const res = await fetch(API_MODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      if (res.ok) {
        setMode(newMode);
      } else {
        console.error("Failed to set mode:", res.status);
      }
    } catch (err) {
      console.error("Error setting mode:", err);
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-6">
      {<p className={`${isAdmin ? 'text-green-500': 'text-red-500'}`}>{isAdmin ? "Admin" : "User"} Mode</p>}
      <button
        onClick={toggleMode}
        disabled={loading == true || !isAdmin == true ? true : false}
        className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
          mode === "manual" ? "bg-blue-500" : "bg-green-500"
        } ${isAdmin == true ? "" : "opacity-50"}`}
      >
        {loading ? "Switching..." : `Mode: ${mode.toUpperCase()}`}
      </button>
    </div>
  );
}
