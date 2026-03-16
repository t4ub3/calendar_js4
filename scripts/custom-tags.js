class CustomCard extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
    }

    connectedCallback() {

        const title = this.getAttribute("title");
        // Create elements safely
        const section = document.createElement("section");

        const h2 = document.createElement("h2");
        h2.className = "card__title";
        h2.textContent = title;

        const hr = document.createElement("hr");
        hr.className = "card__divider";

        const contentWrapper = document.createElement("div");

        // Move existing children instead of copying innerHTML
        while (this.firstChild) {
            contentWrapper.appendChild(this.firstChild);
        }

        section.append(h2, hr, contentWrapper);
        this.appendChild(section);
    }

    // Observe title attribute changes
    static get observedAttributes() { return ["title"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title" && this._elements?.title) {
            this._elements.title.textContent = newValue;
        }
    }

    get title() {
        return this.getAttribute("title");
    }

    set title(value) {
        this.setAttribute("title", value);
    }
}



customElements.define("custom-card", CustomCard);