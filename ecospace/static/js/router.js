// Convert "/events/:id" into a regular expression that captures :id
const pathToRegex = (path) => new RegExp(`^${path.replace(/\//g, "\\/").replace(/:\w+/g, "([^/]+)")}$`);

// Map the params of a path like "/events/:id" to the values in a RegExp match
const getParams = (match) => {
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]); // "/foo/:bar/:baz" => ["bar", "baz"]
    const values = match.result.slice(1);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
};

const router = async () => {
    const routes = [
        { path: "/events", view: EventListView },
        { path: "/events/new", view: CreateEventView },
        { path: "/events/going", view: GoingEventsListView },
        { path: "/events/my", view: MyEventsView },
        { path: "/events/:id", view: EventView },
        { path: "/events/:id/edit", view: EventEditView },
        { path: "/profile", view: MyProfileView },
    ];

    const potentialMatches = routes.map((route) => ({
        route,
        result: window.location.pathname.match(pathToRegex(route.path)),
    }));

    let match = potentialMatches.find(({ result }) => result !== null);
    if (!match) {
        match = {
            route: { path: window.location.pathname, view: NotFoundView },
            result: [null, window.location.pathname],
        };
    }

    updateNavActiveLink();

    const view = new match.route.view(getParams(match));
    const content = document.querySelector("#content");

    content.innerHTML = await view.getHTML();
    view.registerEventListeners(content);
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
