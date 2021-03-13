window.onscroll = function () {
    stickyNav();
};

var navbar = document.querySelector("nav");
var header = document.querySelector("header");

header.style.height = navbar.style.height;

var sticky = navbar.offsetTop;

function stickyNav() {
    if (window.pageYOffset > sticky) {
        navbar.style.background = "#fff";
        navbar.style.borderBottom = "1px solid black";
    } else {
        navbar.style.background = "none";
        navbar.style.borderBottom = "1px solid transparent";
    }
}
