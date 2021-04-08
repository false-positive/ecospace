class EventListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Home");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        console.log(currentUser);
        const events = await getEvents();

        var geocodeService = L.esri.Geocoding.geocodeService({
            apikey: apiKey, // replace with your api key - https://developers.arcgis.com
        });

        return `
            <section class="section-nearme">
                ${Object.entries(events)
                    .sort(function (a, b) {
                        return new Date(a[1].date) - new Date(b[1].date);
                    })
                    .filter(([id]) => {
                        let myid = id;
                        for ([id] of Object.entries(currentUser.events)) {
                            if (id == myid) return false;
                        }
                        for ([id] of Object.entries(currentUser.organized_events)) {
                            if (id == myid) return false;
                        }
                        return true;
                    })
                    .map(
                        ([id, { name, location, date }]) => `
                            <div class="row">
                                <article class="event">
                                    <div class="clearfix first-part">
                                        <h4>${DOMPurify.sanitize(name)}</h4>
                                        <a href="/events/${id}" data-link>More info</a>
                                    </div>
                                    <div class="clearfix second-part">
                                        <h5>Location: ${DOMPurify.sanitize(location)}</h5>
                                    </div>
                                    <div class="clearfix third-part">
                                        <h5>Date: ${formatDate(new Date(date))}</h5>
                                        <a href="#" class="coming-btn coming">I'm coming :)</a>
                                    </div>
                                </article>
                            </div>
                    `
                    )
                    .join("")}
            </section>
        `;
    }

    async getAdress(lat, lng) {
        let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const { display_name } = await response.json();
        console.log(display_name);
    }
}
