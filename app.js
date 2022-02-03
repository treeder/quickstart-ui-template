// plugin.js
import fastifyStatic from 'fastify-static';
import path from 'path';
import { fileURLToPath } from 'url';
import pointOfView from 'point-of-view';
import pug from 'pug';
import { api, apiURL } from './src/api.js'

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
        let msgsR = await api( `${apiURL}/v1/msgs`)
        let msgs = msgsR.messages
        reply.view('/views/index.pug', {
            msgs: msgs,
        })
    })

    fastify.get('/assets/js/api.js', async function (req, reply) {
        reply.header('Content-Type', 'text/javascript')
        reply.view('/assets/js/api.js.pug', {
            apiURL: apiURL,
        })
    })

    fastify.get('/signin', function (req, reply) {
        reply.view('/views/signin.pug')
    })
    // login is temporary until codespaces fixes it
    fastify.get('/login', function (req, reply) {
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

    fastify.setNotFoundHandler(function (request, reply) {
        console.log("not found handler")
        reply
            .code(404)
            //   .type('text/plain')
            .view('/views/404.pug')
    })

    fastify.setErrorHandler(function (error, request, reply) {
        console.log("error handler", error)
        request.log.warn(error)
        let statusCode = error.statusCode >= 400 ? error.statusCode : 500
        if (statusCode === 404) {
            reply
                .code(statusCode)
                //   .type('text/plain')
                .view('/views/404.pug')
            return
        }
        reply
            .code(statusCode)
            .view('/views/error.pug', { message: statusCode >= 500 ? 'Internal server error' : error.message })
    })

}
