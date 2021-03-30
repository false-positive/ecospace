let comingBtns = document.querySelectorAll(".coming-btn");

let token = document.cookie.split(";")[0].split("=")[1];
let { username } = jwt_decode(token);

function changeBtn(element, id) {
    // element.preventDefault();
    if (element.classList.contains("coming")) {
        element.classList.remove("coming");
        element.classList.add("not-coming");
        element.textContent = "I'm not coming :(";
        // changeGoingEvents(id, token);
    } else {
        element.classList.remove("not-coming");
        element.classList.add("coming");
        element.textContent = "I'm coming :)";
        // removeGoingEvents(id, token);
    }
}
