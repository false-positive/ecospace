let firstnameInput = document.querySelector("#firstname");
let lastnameInput = document.querySelector("#lastname");
let passwordInput = document.querySelector("#password");
let submit = document.querySelector("#submit");

submit.addEventListener("click", async () => {
    let firstname = firstnameInput.value.trim();
    let lastname = lastnameInput.value.trim();
    let password = passwordInput.value;

    let response = await fetch(`${URL}/auth`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            full_name: firstname + " " + lastname,
            password,
        }),
    });
    let data = await response.json();
    if (response.ok) {
        // console.log(data);
    }
});
