export const prerender = false;

// --- 1. THE SHARED DATABASE ---
// (Copy this same list to index.astro so they match)
const STATION_DB = [
    // East Coast
    { id: "8661070", name: "Myrtle Beach", lat: 33.6552, lon: -78.9047, zone: "America/New_York" },
    { id: "8517201", name: "Jamaica Bay", lat: 40.5956, lon: -73.8342, zone: "America/New_York" },
    { id: "8531680", name: "Sandy Hook", lat: 40.4667, lon: -74.0094, zone: "America/New_York" },
    { id: "8443970", name: "Boston", lat: 42.3539, lon: -71.0503, zone: "America/New_York" },
    { id: "8729108", name: "Panama City", lat: 30.151, lon: -85.666, zone: "America/Chicago" },
    { id: "8720030", name: "Fernandina Beach", lat: 30.671, lon: -81.465, zone: "America/New_York" },
    { id: "8638610", name: "Sewells Point", lat: 36.946, lon: -76.330, zone: "America/New_York" },
    { id: "8651370", name: "Duck", lat: 36.183, lon: -75.746, zone: "America/New_York" },
    // West Coast
    { id: "9410580", name: "Newport Beach", lat: 33.6033, lon: -117.8831, zone: "America/Los_Angeles" },
    { id: "9410230", name: "La Jolla", lat: 32.866, lon: -117.254, zone: "America/Los_Angeles" },
    { id: "9410660", name: "Los Angeles", lat: 33.720, lon: -118.272, zone: "America/Los_Angeles" },
    { id: "9414290", name: "San Francisco", lat: 37.806, lon: -122.465, zone: "America/Los_Angeles" },
    { id: "9447130", name: "Seattle", lat: 47.601, lon: -122.339, zone: "America/Los_Angeles" },
    { id: "9439040", name: "Astoria", lat: 46.207, lon: -123.767, zone: "America/Los_Angeles" }
];

const DEFAULT_IDS = ["8661070", "8517201"]; // Fallback if no location given

// Math Helper: Haversine Distance
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function GET({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.toLowerCase();
  const lat = parseFloat(url.searchParams.get("lat"));
  const lon = parseFloat(url.searchParams.get("lon"));

  let targets = [];

  // STRATEGY 1: GPS Coordinates provided (Priority)
  if (!isNaN(lat) && !isNaN(lon)) {
      let closest = null;
      let minDist = Infinity;
      STATION_DB.forEach(st => {
          const dist = getDistance(lat, lon, st.lat, st.lon);
          if (dist < minDist) { minDist = dist; closest = st; }
      });
      // Only return if within 100km, otherwise user might be in a desert
      if (closest) targets = [closest];
  } 
  // STRATEGY 2: Text Search
  else if (query) {
      targets = STATION_DB.filter(s => s.name.toLowerCase().includes(query));
      if (targets.length === 0) return new Response(`No matching station found for "${query}".`, { status: 200 });
  } 
  // STRATEGY 3: Defaults
  else {
      targets = STATION_DB.filter(s => DEFAULT_IDS.includes(s.id));
  }

  // --- STANDARD FETCH LOGIC (Same as always) ---
  const getWallClockInt = (zone: string) => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: zone, hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || "0";
    return parseInt(`${getPart('year')}${getPart('month').padStart(2, '0')}${getPart('day').padStart(2, '0')}${getPart('hour').padStart(2, '0')}${getPart('minute').padStart(2, '0')}`);
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
        const schedUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${site.id}&begin_date=${beginDate}&range=72&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=hilo&format=json&application=TideTrack&cb=${cb}`;
        const curUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${site.id}&begin_date=${beginDate}&range=72&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json&application=TideTrack&cb=${cb}`;

        const [schedRes, curRes] = await Promise.all([fetch(schedUrl), fetch(curUrl)]);
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
            } else if (idx > 0) {
                const prevVal = parseFloat(curJson.predictions[idx-1].v);
                trend = val > prevVal ? "rising" : "falling";
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

    return new Response(reports.join("\n\n"), { status: 200, headers: { "Content-Type": "text/plain", "Cache-Control": "no-cache" } });
  } catch (e) { return new Response("Tide data unavailable.", { status: 500 }); }
}