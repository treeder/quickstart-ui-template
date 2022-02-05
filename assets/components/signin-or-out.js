import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@^2/+esm' // 'https://cdn.skypack.dev/lit'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@^0.25.0/+esm';
import { auth, onAuthStateChanged } from '/assets/js/firebase.js'


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
            return html`<mwc-button outlined @click=${this.signOut}>Sign out</mwc-button>`
        }
        return html`<mwc-button unelevated @click=${this.signIn}>Sign in</mwc-button>`
    }

    signIn() {
        window.location.href = '/login'
    }

    async signOut() {
        this.fetching = true
        document.cookie = `userID=;  SameSite=None; Secure; domain=${this.cookieDomain()}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        document.cookie = `session=;  SameSite=None; Secure; domain=${this.cookieDomain()}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        await auth.signOut()
        this.fetching = false
    }

    // todo: put cookie stuff from here and signin.pug into a shared hosted lib (cookie monster)
    cookieDomain() {
        let domain = window.location.hostname
        if (window.location.hostname.includes('githubpreview.dev')) {
            //- domain = 'githubpreview.dev'
        } else if (window.location.hostname.includes('zeromint.com')) {
            domain = 'zeromint.com'
        }
        return domain
    }
}

customElements.define('signin-or-out', SigninOrOut);