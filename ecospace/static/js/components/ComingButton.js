const template = document.createElement("template");
template.innerHTML = `
    <style>
        button {
            /* TODO: Make these reusable */
            font-family: "Lato", "Arial", sans-serif;
            font-weight: 300;
            font-size: 20px;
            text-rendering: optimizeLegibility;
            font-weight: bolder;
            /* End of to-be-made-reusable */
            border: none;
            border-radius: 7px;
            text-decoration: none;
            color: #fff;
            padding: 5px 10px;
            float: right;
            transition: background 0.3s;
            cursor: pointer;
        }

        .coming {
            background: #7ab214;
        }
        .coming:hover {
            background: #85c215;
        }
        .not-coming {
            background: #dc3545;
        }
        .not-coming:hover {
            background: #e15260;
        }
    </style>

    <button></button>
`;

class ComingButton extends HTMLElement {
    constructor() {
        super();

        this.eventId = this.getAttribute("event-id");
        this.coming = this.getAttribute("coming") !== null;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.setComing(this.coming); // force update the text and color
        this.shadowRoot.querySelector("button").style.fontSize = this.getAttribute("font-size") || "100%";
        this.addEventListener("coming", console.log);
    }

    setComing(value) {
        this.coming = value;

        // update the display
        if (this.coming) {
            this.shadowRoot.querySelector("button").innerText = NOT_COMING_TEXT;
            this.shadowRoot.querySelector("button").classList.add("not-coming");
            this.shadowRoot.querySelector("button").classList.remove("coming");
        } else {
            this.shadowRoot.querySelector("button").innerText = COMING_TEXT;
            this.shadowRoot.querySelector("button").classList.remove("not-coming");
            this.shadowRoot.querySelector("button").classList.add("coming");
        }
    }

    async handleClick() {
        // flip the value, so it feels faster
        // if the request goes wrong, it will change color back
        this.setComing(!this.coming);
        const coming = await updateParticipants(this.eventId);
        this.setComing;
        this.comingEvent = new CustomEvent("going", {
            bubbles: true,
            detail: {
                coming,
                eventId: this.eventId,
            },
        });
        document.dispatchEvent(this.comingEvent);
    }

    connectedCallback() {
        this.shadowRoot.querySelector("button").addEventListener("click", () => this.handleClick());
    }
}

window.customElements.define("coming-button", ComingButton);
