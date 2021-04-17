const getGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const { latitude } = position.coords;
                const { longitude } = position.coords;
                // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

                const coords = [latitude, longitude];

                var map = L.map("map").setView(coords, 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                let marker = null;

                map.on("click", function (mapEvent) {
                    if (marker) {
                        marker.remove();
                    }

                    const { lat, lng } = mapEvent.latlng;

                    marker = L.marker([lat, lng]).addTo(map);
                });
            },
            function () {
                alert("Could not get your position!");
            }
        );
    }
};

// the results of getAddress are cached in localStorage for speed and also so we don't get banned from the OSM api
const getAddress = async (lat, lng) => {
    if (!lat || !lng) return null;
    const cachedAddress = localStorage.getItem(`getAddress(${lat},${lng})`);
    if (cachedAddress) {
        return cachedAddress;
    }
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
        const response = await fetch(url);
        const { display_name } = await response.json();
        localStorage.setItem(`getAddress(${lat},${lng})`, display_name);
        return display_name;
    } catch (err) {
        localStorage.setItem(`getAddress(${lat},${lng})`, null);
        return null;
    }
};
