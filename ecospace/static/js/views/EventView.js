class EventView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Loading..."); // Set it to the event title when it gets fetched in getHTML()
    }

    async getHTML() {
        const event = await getEvent(this.params.id);
        AbstractView.setTitle(event.name);

        return `
            <section class="section-info">
                <div class="row">
                    <h1>${escapeHTML(event.name)}</h1>
                    <h5>By ${escapeHTML(event.organizer_username)}</h5>
                </div>
                <div class="row">
                    <p>${DOMPurify.sanitize(event.description)}</p>
                </div>
                <div class="row extra">
                    <h3>Date: ${formatDate(new Date(event.date))}</h3>
                    <h3>Location: ${escapeHTML(event.location)}</h3>
                </div>
            </section>
        `;
    }
}
