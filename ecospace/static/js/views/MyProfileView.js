class MyProfileView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle("Profile");
    }

    async getHTML() {
        const currentUser = await getUserInfo(currentUserUsername);
        console.log(currentUser);
        return `
            <section class="section-profile">
                <div class="content">
                    <div class="row">
                           <div class="col span-1-of-2">
                            <form id="profileForm">
                                <h1 id="username">Username: <span>${escapeHTML(currentUser.username)}</span>
                                    <!-- <button type="submit"><a href="#" class="edit-icon"><i class="ion-edit"></i></a></button> -->
                                </h1>
                                <h2 id="firstname">First Name: 
                                    <input readonly type="text" value="${escapeHTML(currentUser.first_name)}">
                                    <button type="submit"><a href="#" class="edit-icon"><i class="ion-edit"></i></a></button>
                                </h2>
                                <h2 id="lastname">Last Name: 
                                    <input readonly type="text" value="${escapeHTML(currentUser.last_name)}">
                                    <button type="submit"><a href="#" class="edit-icon"><i class="ion-edit"></i></a></button>
                                </h2>
                            <form>
                        </div>
                        <div class="col span-1-of-2">
                            <img class="profile-image" src="${currentUser.avatar_url}" alt="Profile Image">
                            <h3><a href="#" class="logout-btn">Log out</a></h3>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    registerEventListeners(root) {
        const profileForm = root.querySelector("#profileForm");
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const firstnameInput = root.querySelector("#firstname input");
            const lastnameInput = root.querySelector("#lastname input");
            if (firstnameInput.hasAttribute("readonly")) {
                firstnameInput.removeAttribute("readonly");
                root.querySelector("#firstname i").setAttribute("class", "ion-checkmark");
            } else {
                root.querySelector("#firstname i").setAttribute("class", "ion-edit");
                firstnameInput.setAttribute("readonly", "");
                console.log(root.querySelector("#firstname input").value);
                await updateUser({ first_name: root.querySelector("#firstname input").value });
            }
            if (lastnameInput.hasAttribute("readonly")) {
                lastnameInput.removeAttribute("readonly");
                root.querySelector("#lastname i").setAttribute("class", "ion-checkmark");
            } else {
                root.querySelector("#lastname i").setAttribute("class", "ion-edit");
                lastnameInput.setAttribute("readonly", "");
                console.log(root.querySelector("#lastname input").value);
                await updateUser({ last_name: root.querySelector("#lastname input").value });
            }
        });
        root.querySelector(".logout-btn").addEventListener("click", logout);
    }
}
