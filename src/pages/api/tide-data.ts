export const prerender = false;

// --- 1. THE MASTER DATABASE ---
const STATION_DB = [
    // --- NORTHEAST ---
    { id: "8418150", name: "Portland, ME", lat: 43.6567, lon: -70.2467, zone: "America/New_York" },
    { id: "8443970", name: "Boston, MA", lat: 42.3539, lon: -71.0503, zone: "America/New_York" },
    { id: "8447930", name: "Woods Hole, MA", lat: 41.524, lon: -70.671, zone: "America/New_York" },
    { id: "8452660", name: "Newport, RI", lat: 41.504, lon: -71.326, zone: "America/New_York" },
    { id: "8467150", name: "Bridgeport, CT", lat: 41.173, lon: -73.181, zone: "America/New_York" },
    { id: "8510560", name: "Montauk, NY", lat: 41.048, lon: -71.960, zone: "America/New_York" },
    { id: "8518750", name: "The Battery, NYC", lat: 40.700, lon: -74.014, zone: "America/New_York" },
    { id: "8517201", name: "Jamaica Bay, NY", lat: 40.5956, lon: -73.8342, zone: "America/New_York" },
    { id: "8531680", name: "Sandy Hook, NJ", lat: 40.467, lon: -74.009, zone: "America/New_York" },
    { id: "8534720", name: "Atlantic City, NJ", lat: 39.355, lon: -74.418, zone: "America/New_York" },
    // --- MID-ATLANTIC ---
    { id: "8557380", name: "Lewes, DE", lat: 38.782, lon: -75.120, zone: "America/New_York" },
    { id: "8570283", name: "Ocean City, MD", lat: 38.328, lon: -75.091, zone: "America/New_York" },
    { id: "8638610", name: "Sewells Point, VA", lat: 36.946, lon: -76.330, zone: "America/New_York" },
    { id: "8651370", name: "Duck, NC", lat: 36.183, lon: -75.746, zone: "America/New_York" },
    { id: "8656483", name: "Beaufort, NC", lat: 34.720, lon: -76.670, zone: "America/New_York" },
    { id: "8658120", name: "Wilmington, NC", lat: 34.226, lon: -77.953, zone: "America/New_York" },
    // --- SOUTHEAST ---
    { id: "8661070", name: "Myrtle Beach, SC", lat: 33.655, lon: -78.905, zone: "America/New_York" },
    { id: "8665530", name: "Charleston, SC", lat: 32.781, lon: -79.925, zone: "America/New_York" },
    { id: "8670870", name: "Fort Pulaski, GA", lat: 32.034, lon: -80.902, zone: "America/New_York" },
    { id: "8720030", name: "Fernandina Beach, FL", lat: 30.671, lon: -81.465, zone: "America/New_York" },
    { id: "8721604", name: "Trident Pier, FL", lat: 28.416, lon: -80.593, zone: "America/New_York" },
    { id: "8723214", name: "Virginia Key, Miami", lat: 25.731, lon: -80.162, zone: "America/New_York" },
    { id: "8724580", name: "Key West, FL", lat: 24.555, lon: -81.808, zone: "America/New_York" },
    // --- GULF COAST ---
    { id: "8725110", name: "Naples, FL", lat: 26.131, lon: -81.807, zone: "America/New_York" },
    { id: "8726520", name: "St. Petersburg, FL", lat: 27.760, lon: -82.627, zone: "America/New_York" },
    { id: "8727520", name: "Cedar Key, FL", lat: 29.135, lon: -83.031, zone: "America/New_York" },
    { id: "8729108", name: "Panama City, FL", lat: 30.151, lon: -85.666, zone: "America/Chicago" },
    { id: "8729840", name: "Pensacola, FL", lat: 30.404, lon: -87.211, zone: "America/Chicago" },
    { id: "8735180", name: "Dauphin Island, AL", lat: 30.250, lon: -88.075, zone: "America/Chicago" },
    { id: "8761724", name: "Grand Isle, LA", lat: 29.263, lon: -89.956, zone: "America/Chicago" },
    { id: "8771450", name: "Galveston, TX", lat: 29.310, lon: -94.793, zone: "America/Chicago" },
    { id: "8775870", name: "Corpus Christi, TX", lat: 27.580, lon: -97.216, zone: "America/Chicago" },
    { id: "8779770", name: "South Padre Island, TX", lat: 26.069, lon: -97.155, zone: "America/Chicago" },
    // --- WEST COAST ---
    { id: "9410170", name: "San Diego, CA", lat: 32.714, lon: -117.175, zone: "America/Los_Angeles" },
    { id: "9410230", name: "La Jolla, CA", lat: 32.866, lon: -117.254, zone: "America/Los_Angeles" },
    { id: "9410580", name: "Newport Beach, CA", lat: 33.603, lon: -117.883, zone: "America/Los_Angeles" },
    { id: "9410660", name: "Los Angeles, CA", lat: 33.720, lon: -118.272, zone: "America/Los_Angeles" },
    { id: "9411340", name: "Santa Barbara, CA", lat: 34.404, lon: -119.692, zone: "America/Los_Angeles" },
    { id: "9412110", name: "Port San Luis, CA", lat: 35.176, lon: -120.760, zone: "America/Los_Angeles" },
    { id: "9413450", name: "Monterey, CA", lat: 36.604, lon: -121.892, zone: "America/Los_Angeles" },
    { id: "9414290", name: "San Francisco, CA", lat: 37.806, lon: -122.465, zone: "America/Los_Angeles" },
    { id: "9415020", name: "Point Reyes, CA", lat: 37.995, lon: -122.973, zone: "America/Los_Angeles" },
    { id: "9416841", name: "Arena Cove, CA", lat: 38.914, lon: -123.708, zone: "America/Los_Angeles" },
    { id: "9418767", name: "Humboldt Bay, CA", lat: 40.767, lon: -124.217, zone: "America/Los_Angeles" },
    { id: "9419750", name: "Crescent City, CA", lat: 41.745, lon: -124.183, zone: "America/Los_Angeles" },
    // --- PACIFIC NORTHWEST ---
    { id: "9431647", name: "Port Orford, OR", lat: 42.737, lon: -124.498, zone: "America/Los_Angeles" },
    { id: "9435380", name: "South Beach, OR", lat: 44.626, lon: -124.043, zone: "America/Los_Angeles" },
    { id: "9439040", name: "Astoria, OR", lat: 46.207, lon: -123.767, zone: "America/Los_Angeles" },
    { id: "9440910", name: "Toke Point, WA", lat: 46.705, lon: -123.965, zone: "America/Los_Angeles" },
    { id: "9443090", name: "Neah Bay, WA", lat: 48.370, lon: -124.602, zone: "America/Los_Angeles" },
    { id: "9447130", name: "Seattle, WA", lat: 47.601, lon: -122.339, zone: "America/Los_Angeles" }
];

const DEFAULT_IDS = ["8661070", "8517201", "9410580"];

// --- 2. GPS MATH ---
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// --- 3. THE API HANDLER ---
export async function GET({ request }) {
  const url = new URL(request.url);
  
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");
  const query = url.searchParams.get("q")?.toLowerCase();

  const lat = latParam ? parseFloat(latParam) : NaN;
  const lon = lonParam ? parseFloat(lonParam) : NaN;

  let targets = [];
  let introText = "";

  // LOGIC: Build a list that starts with Nearest (if applicable) -> then Defaults
  
  // 1. If GPS provided, find nearest and put it first
  if (!isNaN(lat) && !isNaN(lon)) {
      let closest = null;
      let minDist = Infinity;
      STATION_DB.forEach(st => {
          const dist = getDistance(lat, lon, st.lat, st.lon);
          if (dist < minDist) { minDist = dist; closest = st; }
      });
      
      if (closest && minDist < 150) {
          targets.push(closest);
          introText = "Nearest location tide data. ";
      } else {
          return new Response("You are too far from the coast. No nearby station found.", { status: 200 });
      }
  } 
  // 2. If Search query provided
  else if (query) {
      const found = STATION_DB.filter(s => s.name.toLowerCase().includes(query));
      if (found.length > 0) targets = found;
      else return new Response(`No matching station found for "${query}".`, { status: 200 });
  }

  // 3. ALWAYS Append Defaults (Deduplicated)
  // This ensures the "Standard Cards" are always read after the specific request
  DEFAULT_IDS.forEach(id => {
      // Don't add if it's already in the list (e.g. if Nearest was Myrtle, don't add Myrtle again)
      if (!targets.find(t => t.id === id)) {
          const s = STATION_DB.find(db => db.id === id);
          if (s) targets.push(s);
      }
  });

  // --- 4. NOAA FETCH LOGIC ---
  // OLD BROKEN FUNCTION:
// const getWallClockInt = (zone: string) => { ... }

// NEW FIXED FUNCTION:
const getWallClockInt = (zone: string) => {
    const now = new Date();
    // Convert the UTC server time to the station's local time string
    const localString = now.toLocaleString("en-US", { timeZone: zone, hour12: false });
    // Parse that string back into a Date object to get the parts
    const d = new Date(localString);
    
    // Format as YYYYMMDDHHMM
    return parseInt(
        `${d.getFullYear()}` +
        `${String(d.getMonth() + 1).padStart(2, '0')}` +
        `${String(d.getDate()).padStart(2, '0')}` +
        `${String(d.getHours()).padStart(2, '0')}` +
        `${String(d.getMinutes()).padStart(2, '0')}`
    );
};

  const noaaToInt = (t: string) => parseInt(t.replace(/[- :]/g, ''));
  const getWideNetDate = () => {
    const d = new Date(); d.setDate(d.getDate() - 1); 
    const yyyy = d.getFullYear(); const mm = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  try {
    const reports = await Promise.all(
      targets.map(async (site) => {
        const cb = Date.now();
        const beginDate = getWideNetDate();
        const urlBase = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${site.id}&begin_date=${beginDate}&range=72&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json&application=TideTrack&cb=${cb}`;
        
        const [schedRes, curRes] = await Promise.all([fetch(urlBase + "&interval=hilo"), fetch(urlBase)]);
        const schedJson = await schedRes.json();
        const curJson = await curRes.json();

        let currentLevel = "unknown";
        let trend = "steady";
        let nextEventText = "No upcoming tides";
        
        const nowInt = getWallClockInt(site.timeZone);
        let anchorInt = 0; 

        if (curJson.predictions && curJson.predictions.length > 0) {
            const closest = curJson.predictions.reduce((prev: any, curr: any) => {
                const pInt = noaaToInt(prev.t); const cInt = noaaToInt(curr.t);
                return (Math.abs(nowInt - cInt) < Math.abs(nowInt - pInt) ? curr : prev);
            });
            currentLevel = parseFloat(closest.v).toFixed(1);
            anchorInt = noaaToInt(closest.t);
            const idx = curJson.predictions.indexOf(closest);
            const val = parseFloat(closest.v);
            if (idx < curJson.predictions.length - 1) {
                const nextVal = parseFloat(curJson.predictions[idx+1].v);
                trend = nextVal > val ? "rising" : "falling";
            }
        }

        if (schedJson.predictions && anchorInt > 0) {
            const nextEvent = schedJson.predictions.find((p: any) => noaaToInt(p.t) > anchorInt);
            if (nextEvent) {
                const [_, timePart] = nextEvent.t.split(' ');
                let [h, m] = timePart.split(':');
                let suffix = 'AM';
                let hour = parseInt(h);
                if (hour >= 12) { suffix = 'PM'; if (hour > 12) hour -= 12; }
                if (hour === 0) { hour = 12; }
                const timeStr = `${hour}:${m} ${suffix}`;
                const typeStr = nextEvent.type === 'H' ? "High Tide" : "Low Tide";
                nextEventText = `Next is ${typeStr} at ${timeStr}`;
            }
        }
        return `${site.name} is at ${currentLevel} feet and ${trend}. ${nextEventText}.`;
      })
    );

    // PREPEND THE INTRO TEXT (Only if GPS was used)
    const finalText = introText + reports.join("\n\n");

    return new Response(finalText, { status: 200, headers: { "Content-Type": "text/plain", "Cache-Control": "no-cache" } });
  } catch (e) { return new Response("Tide data unavailable.", { status: 500 }); }
}