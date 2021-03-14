let section = document.querySelector("section");

// let token = document.cookie.split(";")[0].split("=")[1];
// let { username } = jwt_decode(token);

getUserInfo(`/${username}`).then(({ organized_events: response}) => {
    for (const [id, event] of Object.entries(response)) {
        if (event.organiser_username === username) continue;
        let name = DOMPurify.sanitize(event.name);
        let location = DOMPurify.sanitize(event.location);
        let date = new Date(DOMPurify.sanitize(event.date));

        date = date.getFullYear() + "." + date.getMonth() + "." + date.getDate();


        let eventBoxHtml = `
            <div class="row">
                <div class="event">
                    <div class="clearfix first-part">
                        <h4>${name}</h4>
                    </div>
                    <div class="clearfix second-part">
                        <h5>Location: ${location}</h5>
                    </div>
                    <div class="third-part clearfix">
                        <h5>Date: ${date}</h5>
                        <a href="moreinfo.html?${id}" class="coming-btn coming">More info</a>
                    </div>
                </div>
            </div>
            `;

        section.insertAdjacentHTML("beforeend", eventBoxHtml);
    }
});

