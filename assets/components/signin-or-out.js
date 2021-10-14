import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@^2/+esm' // 'https://cdn.skypack.dev/lit'
// import 'https://cdn.jsdelivr.net/npm/@material/mwc-linear-progress@^0.25.0/+esm';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@^2.0.0-beta.57/dist/components/button/button.js/+esm'
// import Decimal from 'https://cdn.skypack.dev/decimal.js';
// import { auth } from '../js/firebase.js'
import { auth } from '/assets/js/firebase.js'
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'


export class SigninOrOut extends LitElement {

    static styles = css`
        a{
            color: #0da9ef;
        }
        .header {
            text-align: center;
        }
        `

    static get properties() {
        return {
            // inputs:
            userID: { type: String },
            symbol: { type: String },

            // internal:
            signedIn: { type: Boolean },
            balance: { type: Object },
            fetching: { type: Boolean },
            error: { type: Object },
        }
    }

    constructor() {
        super();
        this.userID = '';
        this.symbol = '';

        this.balance = {};

        this.fetching = false;
        this.error = null;
        this.signedIn = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    async fetchData() {
        onAuthStateChanged(auth, (user) => {
            console.log("STATE CHANGED in button:", user)
            if (user) {
                this.signedIn = true
            } else {
                this.signedIn = false
            }
        });
    }

    render() {
        if (this.error) {
            return html`Error: ${this.error}`;
        }
        if (this.fetching) {
            return html`<mwc-linear-progress indeterminate></mwc-linear-progress>`;
        }
        if (this.signedIn) {
            return html`<sl-button type="default" @click=${this.signOut}>Sign out</sl-button>`
        }
        return html`<sl-button type="primary" @click=${this.signIn}>Sign in</sl-button>`
    }

    signIn() {
        window.location.href = '/login'
    }

    async signOut() {
        this.fetching = true
        await auth.signOut()
        this.fetching = false
    }
}

customElements.define('signin-or-out', SigninOrOut);