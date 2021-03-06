class EventLabel extends HTMLElement {
    constructor() {
        super();

        const date = new Date(this.getAttribute("iso-date"));
        const tag = document.createElement(this.getAttribute("use-tag") || "h5");
        tag.innerHTML = `<i class="${this.getIcon()}" style="margin-right: 8px"></i>`;
        this.span = document.createElement("span");
        this.span.innerText = "Loading...";
        this.span.className = "location-text";
        tag.appendChild(this.span);

        this.appendChild(tag);
    }

    async connectedCallback() {
        this.span.innerHTML = await this.getSpanText();
    }
}
