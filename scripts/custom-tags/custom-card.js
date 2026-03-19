class CustomCard extends HTMLElement {
    constructor() {
        super();
        this._elements = {};
    }

    connectedCallback() {
        const title = this.getAttribute("card-title");

        const section = document.createElement("section");
        const titleWrapper = document.createElement("div");
        titleWrapper.className = "card__title-wrapper";

        const h2 = document.createElement("h2");
        h2.className = "card__title";
        h2.textContent = title;

        this._elements.title = h2;

        const actions = document.createElement("div");
        actions.className = "card__title-actions";

        this._elements.actions = actions;

        const hr = document.createElement("hr");
        hr.className = "card__divider";

        const contentWrapper = document.createElement("div");

        while (this.firstChild) {
            contentWrapper.appendChild(this.firstChild);
        }

        titleWrapper.append(h2, actions);
        section.append(titleWrapper, hr, contentWrapper);
        this.appendChild(section);
    }

    setActionsContent(...elements) {
        if (!this._elements.actions) return;
        this._elements.actions.replaceChildren(...elements);
    }

    static get observedAttributes() { return ["card-title"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "card-title" && this._elements?.title) {
            this._elements.title.textContent = newValue;
        }
    }

    get cardTitle() {
        return this.getAttribute("card-title");
    }

    set cardTitle(value) {
        this.setAttribute("card-title", value);
    }
}

customElements.define("custom-card", CustomCard);