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

async function updateParticipants(name, description, date, location, organizer, token) {
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

async function getEvent(id) {
    let response = await fetch(`${URL}/events/${id}`, {
        method: "GET",
        // mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}

async function changeGoingEvents(id, token) {
    let response = await fetch(`${URL}/events/${id}/users`, {
        method: "PUT",
        // mode: "no-cors",
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
        },
    });
}

async function removeGoingEvents(id, token) {
    let response = await fetch(`${URL}/events/${id}/users`, {
        method: "DELETE",
        // mode: "no-cors",
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
        },
    });
}
