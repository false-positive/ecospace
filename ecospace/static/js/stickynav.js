window.onscroll = function () {
    stickyNav();
};

var navbar = document.querySelector("nav");
var sticky = navbar.offsetTop;

function stickyNav() {
    if (window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}

const updateNavActiveLink = () => {
    navbar.querySelectorAll("a").forEach((link) => {
        if (window.location.href === link.href) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
};
