class GoingEventsListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("My Events");
    }

    async getHTML() {
        currentUser = await getUserInfo(currentUser.username);
        return `
            <section class="section-nearme">
                ${Object.entries(currentUser.events)
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
}
