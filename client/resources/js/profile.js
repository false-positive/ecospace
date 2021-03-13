let token = document.cookie.split(";")[0].split("=")[1];
let { username } = jwt_decode(token);
document.querySelector("#username").textContent = "Username: " + username;
getUserInfo(username).then((response) => {
    document.querySelector("#fullname").textContent = "Name: " + response.full_name;
});
