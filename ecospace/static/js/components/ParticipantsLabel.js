class ParticipantsLabel extends EventLabel {
    getIcon() {
        return "ion-android-people";
    }
    async getSpanText() {
        return `${this.getAttribute("participants")} Participants`;
    }
}

window.customElements.define("participants-label", ParticipantsLabel);
