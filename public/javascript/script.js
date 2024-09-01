const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log("watch position error", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 100,
      maximumAge: 0, // Fix: corrected typo
    }
  );
}

const map = L.map("map").setView([0, 0], 100);
L.tileLayer(
  "https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=8iqDQJy6PBO10HvGT6Z9",
  {
    attribution: "openstreetmap",
  }
).addTo(map);

const marker = {};

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (marker[id]) {
    marker[id].setLatLng([latitude, longitude]);
  } else {
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});
