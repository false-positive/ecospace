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
                            <h1 id="username">Username: ${escapeHTML(currentUser.username)}</h1>
                            <h2 id="fullname">Name: ${escapeHTML(currentUser.full_name)}</h2>
                        </div>
                        <div class="col span-1-of-2">
                            <h3><a href="#" class="logout-btn" onclick="logout()">Log out</a></h3>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
