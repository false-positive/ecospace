let comingBtns = document.querySelectorAll(".coming-btn");
comingBtns.forEach((element) => {
    element.setAttribute("onclick", "changeBtn(this)");
});

function changeBtn(element) {
    if (element.classList.contains("coming")) {
        element.classList.remove("coming");
        element.classList.add("not-coming");
        element.textContent = "I'm not coming :(";
    } else {
        element.classList.remove("not-coming");
        element.classList.add("coming");
        element.textContent = "I'm coming :)";
    }
}
