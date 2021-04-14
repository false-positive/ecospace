class MyEventsView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("My Events");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        const events = Object.entries(currentUser.organized_events).sort((a, b) => new Date(a[1].date) - new Date(b[1].date));
        let eventHTML;
        if (events.length !== 0) {
            eventHTML = `
                ${events
                    .map(
                        ([id, { name, location, date }]) => `
                        <div class="row">
                            <div class="event">
                                <div class="clearfix first-part">
                                    <h4>${escapeHTML(name)}</h4>
                                    <a href="/events/${id}" data-link>More info</a>
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
                                    <div class="participants-margin">
                                        <participants-label event-id="${id}"></participants-label>
                                    </div>
                                    <a href="/events/${id}/edit" class="coming-btn coming" data-link
                                        ><i class="ion-edit"></i> Edit</a
                                    >
                                </div>
                            </div>
                        </div>
                        `
                    )
                    .join("")}
            `;
        } else {
            eventHTML = `
		    	<section class="section-info empty-page">
				<div class="row">
					<h3>You have no events</h3>
				</div>
				<div class="row">
					<p>
                        You haven't created any events yet. 
                        <a href="/events/new" data-link>Create new event</a>
                    </p>
				</div>
			</section>
            `;
        }

        return `
            <section class="section-nearme section-my-events">
                <div class="row create-event-btn">
                    <a href="/events/new" data-link>Create an event!</a>
                </div>
                ${eventHTML}
            </section>
        `;
    }
}
