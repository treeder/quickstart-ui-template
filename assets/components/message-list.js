import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2/+esm'
import { map } from 'https://cdn.jsdelivr.net/npm/lit@2/directives/map.js/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-icon-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-circular-progress@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-dialog@0/+esm'
import { auth, onAuthStateChanged } from '/assets/js/firebase.js'
import { sharedStyles } from './styles.js'
import zapi from '/assets/js/api.js'

export class MessageList extends LitElement {

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
            messages: { type: Object },

            fetching: { type: Boolean },
            error: { type: Object },
        }
    }

    constructor() {
        super();
        this.messages = null

        this.fetching = false
        this.error = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchData()
    }

    async fetchData() {
        let msgsR = await zapi('/v1/msgs')
        this.messages = msgsR.messages
    }

    render() {
        if (this.error) {
            return html`Error: ${this.error}`;
        }
        if (this.fetching) {
            return html`<mwc-circular-progress indeterminate></mwc-circular-progress>`;
        }
        if (!this.messages) {
            return ''
        }
        return html`
        <div class="gridc">
        ${map(this.messages, (m) => html`<div>
        <a href="/msgs/${m.id}">${m.msg}</a><br/>
        <small>${m.id}</small>
        </div>
        <div style="text-align:right;">
            <mwc-icon-button icon="edit" key=${m.id} @click=${this.handleEdit}></mwc-icon-button>
            <mwc-icon-button icon="delete" key=${m.id} @click=${this.handleDelete}></mwc-icon-button>
        </div>
        `)}
        </div>

        <mwc-dialog id="delete-dialog" heading="Confirm Delete">
        <p>Are you sure you want to delete this item?</p>
        <!-- <mwc-textfield
            id="text-field"
            minlength="3"
            maxlength="64"
            placeholder="First name"
            required>
        </mwc-textfield> -->
        <mwc-button
            id="confirm-delete-button"
            slot="primaryAction"
            dialogAction="ok"
            @click=${this.confirmDelete}>
            Confirm
        </mwc-button>
        <mwc-button
            slot="secondaryAction"
            dialogAction="close">
            Cancel
        </mwc-button>
        </mwc-dialog>
        `
    }

    handleEdit(e) {
        let key = e.target.getAttribute('key')
        console.log("KEY:", key)
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

customElements.define('message-list', MessageList)