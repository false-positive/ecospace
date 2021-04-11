class EventView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Loading..."); // Set it to the event title when it gets fetched in getHTML()
    }

    async getHTML() {
        const event = await getEvent(this.params.id);
        if (!event) {
            return await new NotFoundView().getHTML();
        }
        AbstractView.setTitle(event.name);

        // this view is very ugly
        //
        // please forgive me for this abomination
        // this view will see better days,
        //
        // i promise
        // ~ bozhidar
        return `
            <section class="section-info">
                <div class="row">
                    <h1>${escapeHTML(event.name)}</h1>
                    <user-card username="${event.organizer_username}"></user-card>
                </div>
                <div class="row">
                    <p>${DOMPurify.sanitize(event.description)}</p>
                </div>
                <div class="row extra">
                    <date-label use-tag="h3" iso-date="${event.date}"></date-label>
                    <location-label
                        use-tag="h3"
                        lat="${event.location.split(" ")[0]}"
                        lng="${event.location.split(" ")[1]}"
                        fallback="${event.location}"
                    ></location-label>
                </div>
            </section>
        `;
    }
}
