class LocationLabel extends EventLabel {
    constructor() {
        super();

        this.locationName = this.getAttribute("location-name");
        this.lat = this.getAttribute("lat");
        this.lng = this.getAttribute("lng");
        this.fallback = this.getAttribute("fallback");
    }

    getIcon() {
        return "ion-location";
    }
    async getSpanText() {
        // if locaitonName was provided, just use that
        if (this.locationName) {
            return this.locationName;
        }
        // try to get the address from the OSM Api
        const address = await getAddress(this.lat, this.lng);
        // if the OSM Api doesn't work, return the fallback
        return address || this.fallback;
    }
}

window.customElements.define("location-label", LocationLabel);
