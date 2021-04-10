class EventListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Home");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        console.log(currentUser);
        const events = await getEvents();

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
                                    <h5>
                                        Location:
                                        <span
                                        class="location-text"
                                        data-fallback="${location}"
                                        data-lat="${location.split(" ")[0]}"
                                        data-lng="${location.split(" ")[1]}"
                                        >Loading...</span
                                        >
                                    </h5>
                                </div>
                                    <div class="clearfix third-part">
                                        <h5>Date: ${formatDate(new Date(date))}</h5>
                                        <coming-button event-id="${id}"></coming-button>
                                    </div>
                                </article>
                            </div>
                    `
                    )
                    .join("")}
            </section>
        `;
    }

    registerEventListeners(root) {
        const locations = root.querySelectorAll(".location-text");
        locations.forEach(async (location) => {
            const text = await getAddress(location.dataset.lat, location.dataset.lng);
            location.textContent = text || location.dataset.fallback;
        });
    }
}
