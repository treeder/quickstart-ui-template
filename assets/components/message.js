import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-textfield@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-icon-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-circular-progress@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-dialog@0/+esm'
import { auth, onAuthStateChanged } from '/assets/js/firebase.js'
import { sharedStyles } from './styles.js'
import zapi from '/assets/js/api.js'
import { snack } from 'https://cdn.jsdelivr.net/gh/treeder/web-components@0/tr-snack/tr-snack.js'
import '/assets/components/message-form.js'

export class MessagePage extends LitElement {

    static styles = [
        sharedStyles,
        css`
        a{
            color: #0da9ef;
        }
        .header {
            text-align: center;
        }
        .gridc {
            display: grid;
            grid-template-columns: 2fr, 1fr;
            grid-gap: 10px;
            --mdc-icon-button-size: 24px;
            --mdc-icon-size: 20px;
        }
        `
    ]

    static get properties() {
        return {
            msgID: { type: String },
            message: { type: Object },

            fetching: { type: Boolean },
            error: { type: Object },
        }
    }

    constructor() {
        super();
        this.msgID = ''
        this.message = null

        this.fetching = false
        this.error = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchData()
    }

    async fetchData() {
        let msgsR = await zapi(`/v1/msgs/${this.msgID}`)
        console.log("GOT MSGR:", msgsR)
        this.message = msgsR.message
    }

    render() {
        if (this.error) {
            return html`Error: ${this.error}`;
        }
        if (this.fetching) {
            return html`<mwc-circular-progress indeterminate></mwc-circular-progress>`;
        }

        return html`
        <!-- <mwc-textfield id="msginput" label="Enter a Message" outlined></mwc-textfield> -->
        <mwc-button id="editbtn" @click=${this.handleEdit} >Edit</mwc-button>

        <message-form style="display:none;" id="mform"></message-form>
        `
    }

    async postMsg() {
        let msg = this.renderRoot.querySelector('#msginput').value
        try {
            await zapi('/v1/msgs', { method: 'POST', body: { msg: msg } })
            window.location.reload()
        } catch (e) {
            snack(`${e}`)
        }
    }

    handleEdit(e) {
        let key = e.target.getAttribute('key')
        console.log("KEY:", key)
        let mform = this.renderRoot.querySelector('#mform')
        mform.style.display = 'block'
        mform.message = this.message
    }

    // https://lit.dev/docs/components/events/#listening-to-events-fired-from-repeated-templates
    handleDelete(e) {
        let key = e.target.getAttribute('key')
        console.log("KEY:", key)
        this.msgID = key
        const dialog = this.renderRoot.querySelector('#delete-dialog')
        dialog.key = key
        dialog.show()
        // const textField = this.renderRoot.querySelector('#text-field');
    }

    async confirmDelete(e) {
        console.log('confirmed', e.target)
        console.log('msgID', this.msgID)
        // validate, possible asynchronous such as a server response
        // const isValid = textField.checkValidity();
        // if (isValid) {
        //     dialog.close();
        //     return;
        // }
        // textField.reportValidity();
        let delR = await zapi(`/v1/msgs/${this.msgID}`, { method: 'DELETE', body: {} })
        console.log(delR)
        // let msgsR = await zapi('/v1/msgs', {})
        // this.messages = msgsR.messages

        this.fetchData()
    }


}

customElements.define('message-page', MessagePage)