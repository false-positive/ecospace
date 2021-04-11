class DateLabel extends EventLabel {
    constructor() {
        super();
        this.isoDate = this.getAttribute("iso-date");
    }

    getIcon() {
        return "ion-calendar";
    }
    async getSpanText() {
        const date = new Date(this.isoDate);
        return date.toLocaleDateString();
    }
}

window.customElements.define("date-label", DateLabel);
