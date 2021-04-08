class CreateEventView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Create Event");
    }

    async getHTML() {
        let today = new Date();
        let d = String(today.getDate()).padStart(2, "0");
        let m = String(today.getMonth() + 1).padStart(2, "0");
        let y = today.getFullYear();

        let currentDate = `${y}-${m}-${d}`;

        const currentUser = await getUserInfo(currentUserUsername);
        // console.log(currentUser);
        return `
            <section class="section-create-event">
                <form>
                    <div class="row name">
                        <label>Event name</label>
                        <input type="text" id="name" />
                    </div>
                    <div class="row">
                        <div class="location">
                            <label>Location</label>
                            <input type="text" id="location" />
                        </div>
                        <div class="date">
                            <label>Date</label>
                            <input type="date" id="date" min="${currentDate}" />
                        </div>
                    </div>
                    <div class="row">
                        <label>Event description</label>
                        <textarea rows="10" cols="50" id="description"></textarea>
                    </div>
                    <div class="row">
                        <input type="submit" id="submit" value="Create event" data-link/>
                    </div>
                </form>
            </section>
        `;
    }

    registerEventListeners(root) {
        root.querySelector("#submit").addEventListener("click", this.createEventSubmit);
    }

    async createEventSubmit() {
        // console.log(window.location.pathname);
        let name = DOMPurify.sanitize(document.querySelector("#name").value.trim());
        let location = DOMPurify.sanitize(document.querySelector("#location").value.trim());
        let date = DOMPurify.sanitize(document.querySelector("#date").value.trim());
        let description = DOMPurify.sanitize(document.querySelector("#description").value.trim());
        // console.log(name, location, date, description);

        if (!name || !location || !date || !description) {
            console.log("Empty inputs");
        } else {
            await createEvent(name, description, date, location, currentUserUsername, token);
            // window.location.replace("myevents");
            // window.location.pathname = "events/my";
            navigateTo("my");
            console.log("Success!");
        }
    }
}
