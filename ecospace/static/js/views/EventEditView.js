class EventEditView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Loading...");
    }

    async getHTML() {
        const event = await getEvent(this.params.id);
        if (!event) {
            return await new NotFoundView().getHTML();
        } else if (event.organizer_username !== currentUserUsername) {
            navigateTo(`../${this.params.id}`);
            return "";
        }

        AbstractView.setTitle("Edit Event");

        let today = new Date();
        let d = String(today.getDate()).padStart(2, "0");
        let m = String(today.getMonth() + 1).padStart(2, "0");
        let y = today.getFullYear();

        let currentDate = `${y}-${m}-${d}`;

        console.log(event.date);
        return `
            <section class="section-create-event">
                <form>
                    <div class="row name">
                        <label>Event name</label>
                        <input type="text" id="name" value="${escapeHTML(event.name)}" />
                    </div>
                    <div id="map" data-lat="${event.location.split(" ")[0]}" data-lng="${event.location.split(" ")[1]}"></div>

                    <div class="row">
                        <div class="date">
                            <label>Date</label>
                            <input type="date" id="date" min="${currentDate}" value="${event.date.split("T")[0]}" />
                        </div>
                    </div>
                    <div class="row">
                        <label>Event description</label>
                        <textarea rows="10" cols="50" id="description">${event.description}</textarea>
                    </div>
                    <div class="row">
                        <input type="submit" id="submit" value="Edit event" data-link />
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

                    let mapElement = document.querySelector("#map");

                    const coords = [Number(mapElement.dataset.lat), Number(mapElement.dataset.lng)];

                    let map = L.map("map").setView(coords, 13);

                    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    }).addTo(map);

                    let marker = L.marker(coords).addTo(map);

                    markerLat = coords[0];
                    markerLng = coords[1];

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
        let name = DOMPurify.sanitize(document.querySelector("#name").value.trim());
        let date = DOMPurify.sanitize(document.querySelector("#date").value.trim());
        let description = DOMPurify.sanitize(document.querySelector("#description").value.trim());
        console.log(name, lat, lng, date, description);
        if (!name || !lat || !lng || !date || !description) {
            console.log("Empty inputs");
        } else {
            let location = lat + " " + lng;
            await editEvent(name, description, date, location, currentUserUsername, token, this.params.id);
            navigateTo(`../${this.params.id}`);
            console.log("Success!");
        }
    }
}
