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
        console.log(Object.entries(event.comments));

        return `
            <section class="section-info">
                <div class="event-info">
                    <div class="row">
                        <h1>${escapeHTML(event.name)}</h1>
                        <user-card username="${event.organizer_username}" class="author"></user-card>
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
                </div>
                <div class="comments">
                    <div class="row">
                        <h2>Comments (${event.comments.length}):</h2>
                    </div>
                    <div class="row">
                        <form class="create-comment">
                            <textarea name="content" maxlength = "500" required></textarea>
                            <input type="submit" value="Create Comment" id="create-comment" />
                        </form>
                    </div>
                    <div class="comments-content">
                        ${event.comments
                            .reverse()
                            .map(
                                ({ author, content }) => `
                                    <div class="row">
                                        <user-card username="${author}" class="author"></user-card>
                                        <p>${content}</p>
                                    </div>
                                `
                            )
                            .join("")}
                    </div>
                </div>
                <div class="row last-row"></div>
            </section>
        `;
    }

    registerEventListeners(root) {
        root.querySelector(".create-comment").addEventListener("submit", async (e) => {
            e.preventDefault();
            const content = DOMPurify.sanitize(new FormData(e.target).get("content"));
            await createComment(this.params.id, content);
            document.querySelector(".comments-content").insertAdjacentHTML(
                "afterbegin",
                `<div class="row">
                    <user-card username="${currentUserUsername}" class="author"></user-card>
                    <p>${content}</p>
                </div>`
            );
            navigateTo("");
        });
    }
}
