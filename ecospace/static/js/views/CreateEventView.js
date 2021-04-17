class CreateEventView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Create Event");
    }

    async getHTML() {
        let today = new Date();
        let d = String(today.getDate()).padStart(2, "0");
        let m = String(today.getMonth() + 1).padStart(2, "0");
        let y = today.getFullYear();

        let currentDate = `${y}-${m}-${d}`;

        const currentUser = await getUserInfo(currentUserUsername);
        // console.log(currentUser);
        return `
            <section class="section-create-event">
                <form>
                    <div class="row name">
                        <label>Event name</label>
                        <input type="text" id="name" />
                    </div>
                    <div id="map"></div>

                    <div class="row">
                        <div class="date">
                            <label>Date</label>
                            <input type="date" id="date" min="${currentDate}" />
                        </div>
                    </div>
                    <div class="row">
                        <label>Event description</label>
                        <textarea rows="10" cols="50" id="description"></textarea>
                    </div>
                    <div class="row">
                        <input type="submit" id="submit" value="Create event" data-link />
                    </div>
                </form>
            </section>
        `;
    }

    registerEventListeners(root) {
        let markerLat = null;
        let markerLng = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const { latitude } = position.coords;
                    const { longitude } = position.coords;
                    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

                    const coords = [latitude, longitude];

                    let map = L.map("map").setView(coords, 13);

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
                        markerLat = lat;
                        markerLng = lng;
                    });
                },
                function () {
                    alert("Could not get your position!");
                }
            );
        }
        root.querySelector("#submit").addEventListener("click", () => this.createEventSubmit(markerLat, markerLng));
    }

    async createEventSubmit(lat, lng) {
        // console.log(window.location.pathname);
        let name = DOMPurify.sanitize(document.querySelector("#name").value.trim());
        let date = DOMPurify.sanitize(document.querySelector("#date").value.trim());
        let description = DOMPurify.sanitize(document.querySelector("#description").value.trim());
        // console.log(name, location, date, description);

        if (!name || !lat || !lng || !date || !description) {
            console.log("Empty inputs");
        } else {
            let location = lat + " " + lng;
            await createEvent(name, description, date, location, currentUserUsername, token);
            navigateTo("my");
            console.log("Success!");
        }
    }
}
