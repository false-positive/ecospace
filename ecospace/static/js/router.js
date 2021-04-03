const router = async () => {
    const routes = [
        { path: "/events", view: EventListView },
        { path: "/events/new", view: "events/new" },
        { path: "/events/going", view: "events/going" },
        { path: "/events/my", view: "events/my" },
        { path: "/profile", view: "profile" },
    ];

    const potentialMatches = routes.map((route) => ({ route, result: window.location.pathname === route.path }));

    const match = potentialMatches.find(({ result }) => !!result);
    // TODO: handle no match

    const view = new match.route.view();

    document.querySelector("#content").innerHTML = await view.getHTML();
};

// add the current page to the history and go to next page
const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    router();
};

// make the back and forward buttons work without reloading page
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    router();

    // make all links with data-link attribute not refresh page
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
});
