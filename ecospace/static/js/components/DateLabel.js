class DateLabel extends EventLabel {
    constructor() {
        super();
        this.isoDate = this.getAttribute("iso-date");
    }

    getText() {
        return "Date: ";
    }
    async getSpanHTML() {
        const date = new Date(this.isoDate);
        return date.toLocaleDateString();
    }
}

window.customElements.define("date-label", DateLabel);
