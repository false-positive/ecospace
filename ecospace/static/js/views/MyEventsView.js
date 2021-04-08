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
                    .map(
                        ([id, { name, location, date }]) => `
                            <div class="row">
                                <div class="event">
                                    <div class="clearfix first-part">
                                        <h4>${escapeHTML(name)}</h4>
                                    </div>
                                    <div class="clearfix second-part">
                                        <h5>Location: ${escapeHTML(location)}</h5>
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
}
