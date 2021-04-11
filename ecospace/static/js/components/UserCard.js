const template_ = document.createElement("template");
template_.innerHTML = `
    <style>
        .user-card {
            display: grid;
            grid-template-columns: 1fr 4fr;
            grid-gap: 10px;
            width: 300px;
            margin: 12px 6px 0 0;
            padding-left: 5px;
            border-left: 3px solid #7ab214;
        }
        .user-card img {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 50%;
        }

        .user-info h5 {
            margin-top: auto;
            margin-bottom: 2px;
        }
        .user-info p {
            margin-top: 2px;
            margin-bottom: auto;
        }
    </style>
    
    <div class="user-card">
        <img src="/static/img/icak.jpg" />
        <div class="user-info">
            <h5></h5>
            <p></p>
        </div>
    </div>
`;

class UserCard extends HTMLElement {
    constructor() {
        super();

        this.username = this.getAttribute("username");

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template_.content.cloneNode(true));
        this.shadowRoot.querySelector("p").textContent = `@${this.username}`;
        this.shadowRoot.querySelector("h5").textContent = this.username;
    }

    async connectedCallback() {
        const { full_name, avatar_url } = await getUserInfo(this.username);
        this.shadowRoot.querySelector("img").src = avatar_url;
        this.shadowRoot.querySelector("h5").innerText = full_name;
    }
}

window.customElements.define("user-card", UserCard);
