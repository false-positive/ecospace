class GoingEventsListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Going");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        return `
            <section class="section-nearme">
                ${Object.entries(currentUser.events)
                    .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
                    .map(
                        ([id, { name, location, date, organizer_username }]) => `
                            <div data-card-id="${id}" class="row">
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
                                  <coming-button coming event-id="${id}"></coming-button>
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
