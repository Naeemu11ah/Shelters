mapboxgl.accessToken =
  "pk.eyJ1IjoibmFlZW11bGxhaDAwMSIsImEiOiJjbWs2aGYzeWMwdWN4M2VwdGYzNGZwd3VmIn0.48sugvWZnbM58nzVevyXvQ";

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Accept a few simple formats for `coordinates` injected by the template
  center: (function () {
    try {
      if (typeof coordinates === "undefined" || coordinates === null) return [0, 0];
      if (Array.isArray(coordinates) && coordinates.length === 2) return coordinates;
      if (coordinates && Array.isArray(coordinates.coordinates)) return coordinates.coordinates;
      if (typeof coordinates === "string") {
        const parsed = JSON.parse(coordinates);
        if (Array.isArray(parsed) && parsed.length === 2) return parsed;
        if (parsed && Array.isArray(parsed.coordinates)) return parsed.coordinates;
      }
    } catch (e) {
      console.error("map.js parse coordinates error:", e);
    }
    return [0, 0];
  })(), // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 7, // starting zoom
});
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(map.getCenter().toArray())
  .addTo(map);
