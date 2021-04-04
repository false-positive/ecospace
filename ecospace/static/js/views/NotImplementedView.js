class NotImplementedView extends AbstractView {
    constructor(params) {
        super(params);
        AbstractView.setTitle();
    }

    async getHTML() {
        return `
            <section class="section-profile">
                <div class="content">
                    <div class="row">
                        <div class="col span-1-of-2">
                            <h2>This view is not implemented yet.</h2>
                        </div>
                        <div class="col span-1-of-2">
                            <h3>This is a <em>placeholder</em></h3>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
