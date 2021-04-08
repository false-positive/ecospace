class MyEventsView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("My Events");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        return `
            <section class="section-nearme">
                <div class="row create-event-btn">
                    <a href="/events/new" data-link>Create an event!</a>
                </div>
                ${Object.entries(currentUser.organized_events)
                    .sort(function (a, b) {
                        return new Date(a[1].date) - new Date(b[1].date);
                    })
                    .map(
                        ([id, { name, location, date }]) => `
                            <div class="row">
                                <div class="event">
                                    <div class="clearfix first-part">
                                        <h4>${escapeHTML(name)}</h4>
                                    </div>
                                    <div class="clearfix second-part">
                                        <h5>Location: <span class="location-text" data-lat="${location.split(" ")[0]} data-lng="${location.split(" ")[1]}"></span></h5>
                                    </div>
                                    <div class="third-part clearfix">
                                        <h5>Date: ${formatDate(new Date(date))}</h5>
                                        <a href="/events/${id}" class="coming-btn coming" data-link>More info</a>
                                    </div>
                                </div>
                            </div>
                        `
                    )
                    .join("")}
            </section>
        `;
    }

    registerEventListeners(root) {
        let location = root.querySelector(".location-text");
        location.addEventListener("DOMContentLoaded", async () => {
            const text = await this.getAdress(location.dataset.lat, location.dataset.lng);
            location.textContent = text;
        });
    }

    async getAdress(lat, lng) {
        let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const { display_name } = await response.json();
        console.log(display_name);
    }
}
