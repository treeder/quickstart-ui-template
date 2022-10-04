import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-textfield@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-icon-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-circular-progress@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-dialog@0/+esm'
import { auth, onAuthStateChanged } from '/assets/js/firebase.js'
import { sharedStyles } from './styles.js'
import api from '/assets/js/api.js'
import { snack } from 'https://cdn.jsdelivr.net/gh/treeder/web-components@0/tr-snack/tr-snack.js'


export class MessageForm extends LitElement {

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
            grid-template-columns: 2fr 1fr;
            grid-gap: 10px;
            --mdc-icon-button-size: 24px;
            --mdc-icon-size: 20px;
        }
        .column {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        `
    ]

    static get properties() {
        return {
            message: { type: Object },

            fetching: { type: Boolean },
            error: { type: Object },
        }
    }

    constructor() {
        super();
        this.message = null

        this.fetching = false
        this.error = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchData()
    }

    async fetchData() {
        // let msgsR = await api('/v1/msgs')
        // this.messages = msgsR.messages
    }

    render() {
        if (this.error) {
            return html`Error: ${this.error}`;
        }
        if (this.fetching) {
            return html`<mwc-circular-progress indeterminate></mwc-circular-progress>`;
        }
        console.log(this.message)
        let val = this.message ? this.message.msg : ''
        console.log("VAL:", val)
        return html`
        <div class="column">
        <mwc-textfield id="msginput" label="Enter a Message" outlined value=${val}></mwc-textfield>
        <mwc-textfield id="imageField" type="file" accept="image/*,.mp4"></mwc-textfield>
        <mwc-button id="msgsubmit" @click=${this.postMsg} unelevated>Submit</mwc-button>
        </div>
        `
    }

    handleEdit(e) {
        let key = e.target.getAttribute('key')
        console.log("KEY:", key)
    }

    async postMsg() {
        let text = this.renderRoot.querySelector('#msginput').value
        let urlID = ''
        let msg = {}
        if (this.message) {
            urlID = `/${this.message.id}`
            msg = this.message
        }
        msg.msg = text
        let r = null

        try {
            let imageField = this.renderRoot.querySelector("#imageField")
            let imf = imageField.formElement
            if (imf.files && imf.files.length > 0) {
                let file = imf.files[0]
                // TODO: implement below commented file size check
                //-  if (file.size > MAX_FILE_SIZE) {
                //-     form.classList.add('invalid')
                //-     let cii = document.getElementById("collection-image-invalid")
                //-     cii.innerText = `File too big, max size is ${MAX_FILE_SIZE} by`
                //-     cii.style.display = 'block';
                //-     return
                //- }
                var data = new FormData();
                data.append("json", JSON.stringify({ msg: msg }))
                data.append("image", file)
                console.log("about to upload image")
                snack('Uploading...');
                r = await api(`/v1/msgs${urlID}`, { method: "POST", headers: { 'Content-Type': 'multipart/form-data' }, formData: data })
            } else {
                r = await api(`/v1/msgs${urlID}`, { method: 'POST', body: { msg: msg } })
            }
            console.log(r)
            // window.location.reload()
        } catch (e) {
            console.log(e)
            snack(`${e}`)
        }
    }

}

customElements.define('message-form', MessageForm)