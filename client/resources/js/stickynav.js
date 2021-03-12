window.onscroll = function () {
    stickyNav();
};

var navbar = document.querySelector("nav");

var sticky = navbar.offsetTop;

function stickyNav() {
    if (window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
        navbar.style.background = "#fff";
        navbar.style.borderBottom = "1px solid black";
    } else {
        navbar.classList.remove("sticky");
        navbar.style.background = "none";
        navbar.style.borderBottom = "1px solid transparent";
    }
}
