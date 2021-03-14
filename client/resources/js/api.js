async function register(firstname, lastname, username, password) {
    let response = await fetch(`${URL}/auth`, {
        method: "POST",
        mode: "no-cors",
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

    if (response.ok) {
        console.log(response.status);
        let now = new Date();
        now.setMonth(now.getMonth() + 1);
        document.cookie = `token=${data}; expires=${now.toUTCString()}; SameSite=Strict`;
        window.location.replace("index.html");
    }
}

async function getUserInfo(username) {
    let response = await fetch(`${URL}/users/${username}`, {
        method: "GET",
        mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}

async function getEvents() {
    let response = await fetch(`${URL}/events`, {
        method: "GET",
        mode: "no-cors",
    });
    let { data } = await response.json();

    return data;
}

function logout() {
    document.cookie = "token=; expires= Thu, 21 Aug 2014 20:00:00 UTC; SameSite=Strict";
    window.location.replace("index.html");
}
