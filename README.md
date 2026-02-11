# TideTrack

Real-time tide predictions for 60+ coastal stations across the US.

**Live:** [tides.odesandcodes.com](https://tides.odesandcodes.com)

## Features

- 🌊 **Real-time tide data** from NOAA API
- 📍 **GPS location** - finds nearest tide station automatically
- 📊 **72-hour predictions** - current level, trend, and upcoming highs/lows
- 🗺️ **60+ stations** - covering Atlantic, Pacific, and Gulf coasts
- 📱 **Mobile-optimized** - clean, responsive design

## Coverage

**East Coast:** Maine to Florida Keys  
**Gulf Coast:** Florida to South Padre Island, TX  
**West Coast:** San Diego to Seattle  


## How It Works

1. Click "Find Nearest Station" to use GPS location
2. App calculates distance to all 60+ stations
3. Shows current water level, rising/falling trend, and next 4 tide events
4. Updates every ~6 minutes from NOAA API

## Data Source

All tide predictions sourced from:  
**NOAA CO-OPS API** (Tides and Currents)  
https://api.tidesandcurrents.noaa.gov

- Datum: MLLW (Mean Lower Low Water)
- Units: English (feet)
- Time Zone: Local (station-specific)
- Product: Predictions (not observed)

## Tech Stack

- **Astro** - Static site generation
- **NOAA API** - Tide prediction data
- **Geolocation API** - GPS positioning
- **Vanilla JavaScript** - No frameworks



## Disclaimer

⚠️ **EDUCATIONAL USE ONLY**  

This application provides tide predictions for informational and educational purposes. 

**NOT FOR NAVIGATION** - Do not use for marine navigation, fishing, or any activity where safety depends on accurate tide data. Always consult official NOAA sources and local authorities for critical tide information.

Tide predictions are estimates and may differ from actual conditions due to weather, barometric pressure, and other factors.

## Station Database

60+ stations indexed by NOAA Station ID with precise coordinates and timezone data. See `STATION_DB` array in source for complete list.

## License

MIT

---

Data provided by NOAA/NOS/CO-OPS. All rights reserved.