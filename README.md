# Quickstart UI

This a UI template using:

* fastify
* HTML5 + web components
* firebase for auth

## Getting Started

```sh
nvm install v17
npm install fastify-cli --global
```

After setting up your API from: [API template](https://github.com/treeder/flap-api-template)

Create a `.env` file and put in:

```
API_URL=http://localhost:8080
```

Then:

```sh
make run
```

## Deploying

* Go to https://console.cloud.google.com/ , choose your firebase project
* Go to Cloud run -> create service
* Mostly defaults, but choose deploy from github and choose your repo
    * And use this Dockerfile
* Set `API_URL` to point to your API

