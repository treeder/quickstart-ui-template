// plugin.js
import fastifyStatic from 'fastify-static';
import path from 'path';
import { fileURLToPath } from 'url';
import pointOfView from 'point-of-view';
import pug from 'pug';
import { api, apiUrl } from './src/api.js'

export default async function plugin(fastify, options) {

    fastify.register(pointOfView, {
        engine: {
            ejs: pug,
        }
    })
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, 'assets'),
        prefix: '/assets/', // optional: default '/'
    })

    fastify.get('/', async function (req, reply) {
        let msgsR = await api('get', `${apiUrl()}/v1/msgs`)
        let msgs = msgsR.messages
        reply.view('/views/index.pug', {
            msgs: msgs,
        })
    })

    fastify.get('/abc', function (req, reply) {
        reply.view('/views/signin.pug')
    })

    fastify.get('/tokens/:symbol', async function (req, reply) {
        console.log("PARAMS:", req.params)
        let symbol = req.params.symbol
        let amount = req.query.amount
        let to = req.query.to
        console.log("about to get")
        let tokenR = await api('get', `${apiUrl()}/v1/tokens/${symbol}`)
        console.log("after get")
        let token = tokenR.token
        reply.view('/src/pages/tokens/:id/index.pug', {
            title: token.symbol,
            t: token,
            to: to || '',
            amount: amount || '',
        })
    })

}
