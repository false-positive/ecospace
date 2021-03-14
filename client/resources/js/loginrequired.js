if (!document.cookie) {
    window.location.replace("login.html");
} else {
    let token = document.cookie.split(";")[0].split("=")[1];
    let { exp } = jwt_decode(token);
    if (Date.now() >= exp * 1000) {
        window.location.replace("login.html");
    }
}
