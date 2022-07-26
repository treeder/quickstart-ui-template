# Quickstart UI

This a UI template using:

* fastify
* HTML5 + web components
* firebase for auth

## Getting Started

* Create a Firebase project
* Create a "web app" in Firebase
* Copy the `firebaseConfig` JavaScript code it gives and replace it in [head.pug](https://github.com/treeder/quickstart-ui-template/blob/main/views/head.pug)

Then run it:

```sh
nvm install 18
npm install
npm install fastify-cli --global
```

After setting up your API from: [API template](https://github.com/treeder/quickstart-api-template)

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
    * Use Dockerfile from this repo
* Set `API_URL` env var in cloud run to point to your API
