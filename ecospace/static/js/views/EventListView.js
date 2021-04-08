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
                    .reverse()
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
}
