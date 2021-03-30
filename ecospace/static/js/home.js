let section = document.querySelector("section");
let token = document.cookie.split(";")[0].split("=")[1];
let { username } = jwt_decode(token);

getEvents().then((response) => {
    console.log(response);
    for (const [id, event] of Object.entries(response)) {
        if (event.organizer_username !== username) {
            let name = DOMPurify.sanitize(event.name);
            let location = DOMPurify.sanitize(event.location);
            let date = new Date(DOMPurify.sanitize(event.date));

            date = date.getFullYear() + "." + date.getMonth() + "." + date.getDate();

            // event.forEach((element) => {});

            // console.log(event);

            // let onclick = `onclick="changeBtn(this, '${newid}')`";

            let eventBoxHtml = `
            <div class="row">
                <div class="event">
                    <div class="clearfix first-part">
                        <h4>${name}</h4>
                        <a href="moreinfo?${id}">More info</a>
                    </div>
                    <div class="clearfix second-part">
                        <h5>Location: ${location}</h5>
                    </div>
                    <div class="third-part clearfix">
                        <h5>Date: ${date}</h5>
                        <a href="#" class="coming-btn coming" onclick="changeBtn(this, '${id}')">I'm coming :)</a>
                    </div>
                </div>
            </div>
            `;

            section.insertAdjacentHTML("afterbegin", eventBoxHtml);
        }
    }
});
