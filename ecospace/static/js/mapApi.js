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
