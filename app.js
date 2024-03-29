import path from 'path'
import { fileURLToPath } from 'url'
import pointOfView from '@fastify/view'
import pug from 'pug'
import * as eta from 'eta'
import { api, apiURL } from './src/api.js'
import fastifyStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'

export default async function plugin(fastify, options) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    fastify.register(pointOfView, {
        engine: {
            pug: pug,
        }
    })
    fastify.register(pointOfView, {
        engine: {
            eta: eta,
        },
        propertyName: "eta",
    })

    fastify.register(fastifyCookie)
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/public/', // optional: default '/'
    })

    fastify.get('/', async function (req, reply) {
        let msgsR = await api(`${apiURL}/v1/msgs`, { sessionCookie: req.cookies.session })
        let msgs = msgsR.messages
        return reply.eta('/views/index.eta', {
            msgs: msgs,
        })
    })

    fastify.get('/pug', async function (req, reply) {
        let msgsR = await api(`${apiURL}/v1/msgs`, { sessionCookie: req.cookies.session })
        let msgs = msgsR.messages
        return reply.view('/views/index.pug', {
            msgs: msgs,
        })
    })

    fastify.get('/public/js/api.js', async function (req, reply) {
        reply.header('Content-Type', 'text/javascript')
        return reply.view('/public/js/api.js.pug', {
            apiURL: apiURL,
        })
    })
    fastify.get('/signin', function (req, reply) {
        return reply.eta('/views/signin.eta')
    })
    // login is temporary until codespaces fixes it
    fastify.get('/login', function (req, reply) {
        return reply.eta('/views/signin.eta')
    })

    fastify.get('/msgs/new', async function (req, reply) {
        return reply.view('/views/message-form.pug', {
        })
    })


    fastify.get('/msgs/:id', async function (req, reply) {
        let msgsR = await api(`${apiURL}/v1/msgs/${req.params['id']}`, { sessionCookie: req.cookies.session })
        let msg = msgsR.message
        return reply.view('/views/message.pug', {
            msg: msg,
        })
    })



    fastify.setNotFoundHandler(function (request, reply) {
        console.log("not found handler")
        return reply
            .code(404)
            //   .type('text/plain')
            .view('/views/404.pug')
    })

    fastify.setErrorHandler(function (error, request, reply) {
        console.log("error handler", error)
        request.log.warn(error)
        let statusCode = error.statusCode || error.status
        console.log(statusCode)
        if (!statusCode) {
            statusCode = 500
        }
        if (statusCode === 404) {
            reply
                .code(statusCode)
                //   .type('text/plain')
                .view('/views/404.pug')
            return
        }
        return reply
            .code(statusCode)
            .view('/views/error.pug', { message: statusCode >= 500 ? 'Internal server error' : error.message })
    })

}
