class MyEventsView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("My Events");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        return `
            <section class="section-nearme section-my-events">
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
                                    <a href="/events/${id}/edit" data-link>Edit</a>
                                </div>
                                <div class="clearfix second-part">
                                    <location-label
                                        lat="${location.split(" ")[0]}"
                                        lng="${location.split(" ")[1]}"
                                        fallback="${location}"
                                    ></location-label>
                                </div>
                                <div class="third-part clearfix">
                                    <date-label iso-date="${date}"></date-label>
                                    <a href="/events/${id}" class="coming-btn coming" data-link
                                        >More info</a
                                    >
                                </div>
                            </div>
                        </div>
                        `
                    )
                    .join("")}
            </section>
        `;
    }
}
