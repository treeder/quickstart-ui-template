// This is for hosting the final app (ie: outside fastify cli)

console.log("Starting up server")

import Fastify from 'fastify'
const fastify = Fastify({
    http2: true,
    logger: true
})

import appService from './app.js'
fastify.register(appService)


// Declare a route
// fastify.get('/', async (request, reply) => {
//     // return { hello: 'world' }
//     reply.view('/src/index.pug')
// })


// Run the server!
let port = process.env.PORT || 3000;

fastify.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
