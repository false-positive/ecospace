class EventListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Home");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        console.log(currentUser);
        const events = await getEvents();
        const eventsFiltered = Object.entries(events)
            .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
            .filter(([_, { organizer_username }]) => currentUserUsername !== organizer_username)
            .filter(([_, { participants }]) => !participants.includes(currentUserUsername));

        if (eventsFiltered.length === 0) {
            return `
		    	<section class="section-info">
				<div class="row">
					<h3>No Events Found</h3>
				</div>
				<div class="row">
					<p>
						We couldn't find any events suitable for you
					</p>
				</div>
			</section>
		    `;
        }

        return `
            <section class="section-nearme">
                ${eventsFiltered
                    .map(
                        ([id, { name, location, date, organizer_username, participants }]) => `
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
                                        <div class="participants-margin">
                                            <participants-label participants="${Object.keys(participants).length}"></participants-label>
                                        </div>
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
