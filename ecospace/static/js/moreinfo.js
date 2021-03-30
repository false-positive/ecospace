let id = window.location.toString().split("?")[1];
getEvent(id).then((response) => {
    if (response === undefined) {
        window.location.replace("/");
    } else {
        let date = new Date(response.date);
        date = date.getFullYear() + "." + date.getMonth() + "." + date.getDate();

        document.querySelector("h1").textContent = response.name;
        document.querySelector("h5").textContent = "By " + response.organizer_username;
        document.querySelector("p").textContent = response.description;
        document.querySelector("h3:first-child").textContent = "Date: " + date;
        document.querySelector("h3:last-child").textContent = "Loaction: " + response.location;
        // console.log(response);
    }
});
