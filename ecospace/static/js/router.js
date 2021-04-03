const router = () => {
    const routes = [
        { path: "/events", view: "events" },
        { path: "/events/new", view: "events/new" },
        { path: "/events/going", view: "events/going" },
        { path: "/events/my", view: "events/my" },
        { path: "/profile", view: "profile" },
    ];

    const potentialMatches = routes.map((route) => ({ route, result: window.location.pathname === route.path }));

    const match = potentialMatches.find(({ result }) => !!result);
    // TODO: handle no match

    document.querySelector("#content").innerHTML = match.route.view;
};

document.addEventListener("DOMContentLoaded", router);
