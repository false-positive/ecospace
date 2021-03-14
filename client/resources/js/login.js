let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let loginBtn = document.querySelector("#login");

loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let username = usernameInput.value.trim();
    let password = passwordInput.value;

    if (!username || !password) {
        console.log("Empty inputs");
    } else {
        login(username, password);
    }
});
