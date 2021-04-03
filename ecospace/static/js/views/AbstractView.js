class AbstractView {
    constructor(params) {
        this.params = params;
    }

    static setTitle(title) {
        if (title) {
            document.title = `${title} // ECOspace`;
        } else {
            document.title = "ECOspace";
        }
    }

    async getHTML() {
        return "";
    }
}
