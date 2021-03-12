let isNavSticky = false;
let mouseOver = false;

window.onscroll = function () {
    stickyNav();
};

var css = "nav-btns a:first-child:hover,.nav-btns a:first-child:active { background: #85c215; }";

var navbar = document.querySelector("nav");
var loginBtn = document.querySelector(".nav-btns a:first-child");

var sticky = navbar.offsetTop;

loginBtn.addEventListener("mouseover", function () {
    mouseOver = true;
    loginBtn.style.background = "#85c215";
});

loginBtn.addEventListener("mouseout", function () {
    mouseOver = false;
    if (isNavSticky) loginBtn.style.background = "#7ab214";
    else loginBtn.style.background = "none";
});

function stickyNav() {
    if (window.pageYOffset > sticky) {
        isNavSticky = true;
        navbar.classList.add("sticky");
        navbar.style.background = "#fff";
        navbar.style.borderBottom = "1px solid black";
        if (!mouseOver) loginBtn.style.background = "#7ab214";
    } else {
        isNavSticky = false;
        navbar.classList.remove("sticky");
        navbar.style.background = "none";
        navbar.style.borderBottom = "1px solid transparent";
        if (!mouseOver) loginBtn.style.background = "none";
    }
}
