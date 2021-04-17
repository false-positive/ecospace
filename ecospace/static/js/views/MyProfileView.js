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
                            <form>
                                <h1 id="username">Username: <span>${escapeHTML(currentUser.username)}</span>
                                    <!-- <button type="submit"><a href="#" class="edit-icon"><i class="ion-edit"></i></a></button> -->
                                </h1>
                                <h2 id="fullname">Name: 
                                    <input readonly type="text" value="${escapeHTML(currentUser.full_name)}">
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
        const fullnameSubmit = root.querySelector("#fullname button");
        fullnameSubmit.addEventListener("click", async () => {
            let fullnameInput = root.querySelector("#fullname input");
            if (fullnameInput.hasAttribute("readonly")) {
                fullnameInput.removeAttribute("readonly");
                root.querySelector("#fullname i").setAttribute("class", "ion-checkmark");
            } else {
                root.querySelector("#fullname i").setAttribute("class", "ion-edit");
                fullnameInput.setAttribute("readonly", "");
                console.log(root.querySelector("#fullname input").value);
                await updateUser(root.querySelector("#fullname input").value);
            }
        });
        root.querySelector(".logout-btn").addEventListener("click", logout);
    }
}
