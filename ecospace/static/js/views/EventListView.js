class EventListView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Home");
    }

    async toggleComingBtn({ target: comingBtn }) {
        const eventId = comingBtn.dataset.comingId;
        const isComing = await updateParticipants(eventId);
        if (isComing) {
            comingBtn.classList.remove("coming");
            comingBtn.classList.add("not-coming");
            comingBtn.innerText = NOT_COMING_TEXT;
        } else {
            comingBtn.classList.add("coming");
            comingBtn.classList.remove("not-coming");
            comingBtn.innerText = COMING_TEXT;
        }
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        console.log(currentUser);
        const events = await getEvents();

        return `
            <section class="section-nearme">
                ${Object.entries(events)
                    .sort(function (a, b) {
                        return new Date(a[1].date) - new Date(b[1].date);
                    })
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
                                        <button data-coming-id="${id}" class="coming-btn coming">${COMING_TEXT}</button>
                                    </div>
                                </article>
                            </div>
                    `
                    )
                    .join("")}
            </section>
        `;
    }

    registerEventListeners(root) {
        root.querySelectorAll("button[data-coming-id]").forEach((btn) => {
            btn.addEventListener("click", this.toggleComingBtn);
        });
    }

    async getAdress(lat, lng) {
        let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const { display_name } = await response.json();
        console.log(display_name);
    }
}
