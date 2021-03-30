let dateInput = document.querySelector("input[type=date]");

let today = new Date();
let d = String(today.getDate()).padStart(2, "0");
let m = String(today.getMonth() + 1).padStart(2, "0");
let y = today.getFullYear();

let currentDate = `${y}-${m}-${d}`;

dateInput.setAttribute("min", currentDate);

let nameInput = document.querySelector("#name");
let locationInput = document.querySelector("#location");
dateInput = document.querySelector("#date");
let descriptionInput = document.querySelector("#description");
let submit = document.querySelector("#submit");

submit.addEventListener("click", async (e) => {
    e.preventDefault();
    let name = nameInput.value.trim();
    let location = locationInput.value.trim();
    let date = dateInput.value.trim();
    let description = descriptionInput.value.trim();

    let token = document.cookie.split(";")[0].split("=")[1];
    let { username } = jwt_decode(token);

    // console.log(description);

    if (!name || !location || !date || !description) {
        console.log("Empty inputs");
    } else {
        await createEvent(name, description, date, location, username, token);
        window.location.replace("myevents")
    }
});
