class CustomButtonGroup extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
    }

    connectedCallback() {
        //setup html elements
    }

}

customElements.define("custom-button-group", CustomButtonGroup);