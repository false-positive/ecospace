let firstnameInput = document.querySelector("#firstname");
let lastnameInput = document.querySelector("#lastname");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let registerBtn = document.querySelector("#register");

registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let firstname = firstnameInput.value.trim();
    let lastname = lastnameInput.value.trim();
    let username = usernameInput.value.trim();
    let password = passwordInput.value;

    if (!firstname || !lastname || !username || !password) {
        console.log("Empty inputs");
    } else {
        register(firstname, lastname, username, password);
    }
});
