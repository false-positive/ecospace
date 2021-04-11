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
                        ([id, { name, location, date, organizer_username }]) => `
                            <div class="row">
                                <article class="event">
                                    <div class="clearfix first-part">
                                        <h4>${DOMPurify.sanitize(name)}</h4>
                                        <a href="/events/${id}" data-link>More info</a>
                                    </div>
                                    <user-card username="${organizer_username}"></user-card>
                                    <div class="clearfix second-part">
                                        <location-label
                                            lat="${location.split(" ")[0]}"
                                            lng="${location.split(" ")[1]}"
                                            fallback="${location}"
                                        ></location-label>
                                    </div>
                                    <div class="clearfix third-part">
                                        <date-label iso-date="${date}"></date-label>
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
}
