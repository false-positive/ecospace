let section = document.querySelector("section");

getEvents().then((response) => {
    for (const [id, event] of Object.entries(response)) {
        let name = DOMPurify.sanitize(event.name);
        let location = DOMPurify.sanitize(event.location);
        let date = new Date(DOMPurify.sanitize(event.date));

        date = date.getFullYear() + "." + date.getMonth() + "." + date.getDate();

        console.log(event);

        let eventBoxHtml = `
            <div class="row">
                <div class="event">
                    <div class="clearfix first-part">
                        <h4>${name}</h4>
                        <a href="moreinfo.html">More info</a>
                    </div>
                    <div class="clearfix second-part">
                        <h5>Location: ${location}</h5>
                    </div>
                    <div class="third-part clearfix">
                        <h5>Date: ${date}</h5>
                        <a href="#" class="coming-btn coming" onclick='changeBtn()'>I'm coming :)</a>
                    </div>
                </div>
            </div>
            `;

        section.insertAdjacentHTML("afterbegin", eventBoxHtml);
    }
});
