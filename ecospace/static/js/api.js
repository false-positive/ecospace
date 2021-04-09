async function register(firstname, lastname, username, password) {
    let response = await fetch(`${URL}/auth`, {
        method: "POST",
        // mode: "no-cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            full_name: firstname + " " + lastname,
            password,
        }),
    });
    let data = await response.json();
    // console.log(data);
    if (response.ok) {
        login(username, password);
    }
    return data;
}

async function login(username, password) {
    let response = await fetch(`${URL}/auth`, {
        method: "GET",
        // mode: "no-cors",
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
    });
    let { data } = await response.json();

    // console.log(data);

    if (data !== undefined) {
        // console.log(response.status);
        let now = new Date();
        now.setMonth(now.getMonth() + 1);
        document.cookie = `token=${data}; expires=${now.toUTCString()}; SameSite=Strict`;
        window.location.replace("/");
    }
}

async function getUserInfo(username) {
    // console.log(`${URL}/users/${username}`);
    let response = await fetch(`${URL}/users/${username}`, {
        method: "GET",
        // mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}

async function getEvents() {
    let response = await fetch(`${URL}/events`, {
        method: "GET",
        // mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}

function logout() {
    document.cookie = "token=; expires= Thu, 21 Aug 2014 20:00:00 UTC; SameSite=Strict";
    window.location.replace("/");
}

async function createEvent(name, description, date, location, organizer, token) {
    // alert(description);
    let response = await fetch(`${URL}/events`, {
        method: "POST",
        // mode: "no-cors",
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            date,
            description,
            location,
            organizer_username: organizer,
        }),
    });
    let data = await response.json();
    // console.log(data);
    // console.log(response.status);
}

async function editEvent(name, description, date, location, organizer, token, eventId) {
    let response = await fetch(`${URL}/events/${eventId}`, {
        method: "PUT",
        // mode: "no-cors",
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            date,
            description,
            location,
            organizer_username: organizer,
        }),
    });
    let data = await response.json();
}

// returns true if user gets added in event, false if he doesn't
async function updateParticipants(eventId) {
    const event = await getEvent(eventId);
    if (event.organizer_username === currentUserUsername) return true; // the user is the organizer of the event

    const isIn = event.participants.find((username) => username === currentUserUsername) !== undefined;

    const response = await fetch(`${URL}/events/${eventId}/users`, {
        headers: { "x-access-token": token },
        method: isIn ? "DELETE" : "PUT",
    });
    if (!response.ok) return isIn;

    return !isIn; // XXX: Asuming that if the response was ok, then the state is flipped
}

async function getEvent(id) {
    let response = await fetch(`${URL}/events/${id}`, {
        method: "GET",
        // mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}
