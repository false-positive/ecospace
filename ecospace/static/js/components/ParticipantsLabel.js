class ParticipantsLabel extends EventLabel {
    constructor() {
        super();
        document.addEventListener("coming", () => console.log("hello"));
    }

    getIcon() {
        return "ion-android-people";
    }
    async getSpanText() {
        return `${this.getAttribute("participants")} Participants`;
    }
}

window.customElements.define("participants-label", ParticipantsLabel);
