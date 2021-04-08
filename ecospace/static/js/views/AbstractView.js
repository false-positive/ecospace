const formatDate = (date) => date.toLocaleDateString();

const escapeHTML = (unsafe) => {
    const p = document.createElement("p");
    p.textContent = unsafe;
    return p.innerHTML;
};

class AbstractView {
    constructor(params) {
        this.params = params;
        console.log(this.params);
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

    // override in base class to register event listeners
    registerEventListeners(root) {}
}
