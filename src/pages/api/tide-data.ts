export const prerender = false;

const STATION_DB = [
    // ... (Keep your massive list from before, I won't repeat it here to save space) ...
    // ... PASTE THE FULL STATION_DB ARRAY HERE ...
    { id: "8418150", name: "Portland, ME", lat: 43.6567, lon: -70.2467, zone: "America/New_York" },
    { id: "8443970", name: "Boston, MA", lat: 42.3539, lon: -71.0503, zone: "America/New_York" },
    { id: "8517201", name: "Jamaica Bay, NY", lat: 40.5956, lon: -73.8342, zone: "America/New_York" },
    { id: "8661070", name: "Myrtle Beach, SC", lat: 33.655, lon: -78.905, zone: "America/New_York" },
    { id: "9410580", name: "Newport Beach, CA", lat: 33.603, lon: -117.883, zone: "America/Los_Angeles" }
    // (Make sure you keep the full list in your actual file!)
];

const DEFAULT_IDS = ["8661070", "8517201", "9410580"];

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
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");
  
  // PARSING DEBUG
  const lat = latParam ? parseFloat(latParam) : NaN;
  const lon = lonParam ? parseFloat(lonParam) : NaN;

  let targets = [];
  let introText = "";

  // DIAGNOSTIC VOICE MESSAGE
  // If the server doesn't get numbers, it will tell you "No GPS".
  if (isNaN(lat) || isNaN(lon)) {
      introText += "No GPS data received. "; 
  } else {
      introText += `GPS Received. Lat ${lat.toFixed(1)}. `;
  }

  // 1. GPS LOGIC
  if (!isNaN(lat) && !isNaN(lon)) {
      let closest = null;
      let minDist = Infinity;
      STATION_DB.forEach(st => {
          const dist = getDistance(lat, lon, st.lat, st.lon);
          if (dist < minDist) { minDist = dist; closest = st; }
      });
      
      if (closest && minDist < 150) {
          targets.push(closest);
          introText += `Nearest station is ${closest.name}. `;
      } else {
          introText += "No station found nearby. ";
      }
  } 

  // 2. DEFAULTS
  DEFAULT_IDS.forEach(id => {
      if (!targets.find(t => t.id === id)) {
          const s = STATION_DB.find(db => db.id === id);
          if (s) targets.push(s);
      }
  });

  // --- TIME HELPER ---
  const getStationTime = (zone) => {
    const now = new Date();
    const options = { timeZone: zone, hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    const getPart = (type) => parts.find(p => p.type === type)?.value || "0";
    return parseInt(`${getPart('year')}${getPart('month').padStart(2, '0')}${getPart('day').padStart(2, '0')}${getPart('hour').padStart(2, '0')}${getPart('minute').padStart(2, '0')}`);
  };

  const noaaToInt = (t) => parseInt(t.replace(/[- :]/g, ''));
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
        
        const stationTimeInt = getStationTime(site.zone);

        if (curJson.predictions) {
            const closest = curJson.predictions.reduce((prev, curr) => {
                const pInt = noaaToInt(prev.t); const cInt = noaaToInt(curr.t);
                return (Math.abs(stationTimeInt - cInt) < Math.abs(stationTimeInt - pInt) ? curr : prev;
            });
            currentLevel = parseFloat(closest.v).toFixed(1);
            const idx = curJson.predictions.indexOf(closest);
            if (idx < curJson.predictions.length - 1) {
                trend = parseFloat(curJson.predictions[idx+1].v) > parseFloat(currentLevel) ? "rising" : "falling";
            }
        }

        if (schedJson.predictions) {
            const nextEvent = schedJson.predictions.find(p => noaaToInt(p.t) > stationTimeInt);
            if (nextEvent) {
                const [_, timePart] = nextEvent.t.split(' ');
                let [h, m] = timePart.split(':');
                let suffix = 'AM';
                let hour = parseInt(h);
                if (hour >= 12) { suffix = 'PM'; if (hour > 12) hour -= 12; }
                if (hour === 0) { hour = 12; }
                nextEventText = `Next is ${nextEvent.type === 'H' ? "High" : "Low"} Tide at ${hour}:${m} ${suffix}`;
            }
        }
        return `${site.name} is at ${currentLevel} feet and ${trend}. ${nextEventText}.`;
      })
    );

    const finalText = introText + "\n\n" + reports.join("\n\n");
    return new Response(finalText, { status: 200, headers: { "Content-Type": "text/plain", "Cache-Control": "no-cache" } });
  } catch (e) { return new Response("Error fetching data.", { status: 500 }); }
}