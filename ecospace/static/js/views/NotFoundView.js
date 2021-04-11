class NotFoundView extends AbstractView {
    constructor() {
        super();
        AbstractView.setTitle("Not Found");
    }

    async getHTML() {
        return `
            <section class="section-info">
                <div class="row">
                    <h1 style="margin-bottom: 30px">
                        <strong>NOT</strong> Found <i class="ion-sad"></i>
                    </h1>
                </div>
                <div class="row">
                    <p>
                        There is no page at this url.
                    </p>
                    <p style="margin-bottom: 30px">
                        If you somehow got here,
                        you either followed a broken link,
                        or you mistyped the url.
                    </p>
                    <p>
                        Either way, you might want to 
                        <a href="/events" data-link>
                            get out of this abandoned place
                        </a>
                        .
                    </p>
                </div>
            </section>
        `;
    }
}
