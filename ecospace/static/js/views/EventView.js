class EventView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Loading..."); // Set it to the event title when it gets fetched in getHTML()
    }

    async getHTML() {
        const event = await getEvent(this.params.id);
        AbstractView.setTitle(event.name);

        return `
            <section class="section-info">
                <div class="row">
                    <h1>${escapeHTML(event.name)}</h1>
                    <h5>By ${escapeHTML(event.organizer_username)}</h5>
                </div>
                <div class="row">
                    <p>${DOMPurify.sanitize(event.description)}</p>
                </div>
                <div class="row extra">
                    <date-label use-tag="h3" iso-date="${event.date}"></date-label>
                    <h3>
                        Location:
                        <span
                        class="location-text"
                        data-fallback="${event.location}"
                        data-lat="${event.location.split(" ")[0]}"
                        data-lng="${event.location.split(" ")[1]}"
                        >Loading...</span
                        >
                    </h3>
                </div>
            </section>
        `;
    }

    registerEventListeners(root) {
        const locations = root.querySelectorAll(".location-text");
        locations.forEach(async (location) => {
            const text = await this.getAdress(location.dataset.lat, location.dataset.lng);
            location.textContent = text || location.dataset.fallback;
        });
    }

    async getAdress(lat, lng) {
        let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        try {
            const response = await fetch(url);
            const { display_name } = await response.json();
            console.log(display_name);
            return display_name;
        } catch (err) {
            return null;
        }
    }
}
