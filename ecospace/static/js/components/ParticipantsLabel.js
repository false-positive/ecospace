class ParticipantsLabel extends EventLabel {
    constructor() {
        super();
        this.eventId = this.getAttribute("event-id");
        document.addEventListener("coming", async (e) => {
            if (e.detail.eventId !== this.eventId) return;
            this.span.innerText = await this.getSpanText();
        });
    }
    getIcon() {
        return "ion-android-people";
    }
    async getSpanText() {
        const { participants } = await getEvent(this.eventId);
        return `${participants.length} Participants`;
    }
}

window.customElements.define("participants-label", ParticipantsLabel);
