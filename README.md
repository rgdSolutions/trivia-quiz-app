# FAST FullStack React with TypeScript starter kit.

<img src="https://github.com/gilamran/fullstack-typescript/raw/master/assets/images/logo.png" width="150">

---

## Quick Start

If you're using Github, you can click on the "Use this template" button to create a new repository based on this starter kit.

## Clean example code
The repo comes with some examples on how to do basic stuff. As this is not really needed in real projects, you can remove them by running:
```
yarn clean-up-example-code
```

## Manual clone
clone this repository into your own project folder. and start working

```bash
git clone https://github.com/gilamran/fullstack-typescript.git <MyProjectName>
cd <MyProjectName>
yarn
yarn dev
```

If you want to detach from this repository into your own repository do this:

```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
git push -u origin master
```

## Why

- **Simple** to jump into, **Fast** because it is simple.
- Separate `tsconfig.json` for client and server.
- Client and server can share code (And types). For example: [IUserDTO.d.ts](https://github.com/gilamran/fullstack-typescript/blob/master/src/shared/IUserDTO.d.ts)
- The client is bundled using [Vite](https://github.com/vitejs/vite) because it goes to the browser.
- The server is emitted by [TypeScript](https://github.com/Microsoft/TypeScript) because node now supports es6.

<p align="center"> 
<img src="https://github.com/gilamran/fullstack-typescript/raw/master/assets/images/flow.png" width="500">
</p>

---

## Requirements

- `NodeJs 22.12.+`, `Chrome 79+` or `FireFox 72+`

### Directory Layout

```bash
.
├── /node_modules/                    # 3rd-party libraries and utilities
├── /dist/                            # All the generated files will go here, and will run from this folder
├── /src/                             # The source code of the application
│   ├── /client/                      # React app
│   ├── /server/                      # Express server app
│   ├── /shared/                      # The shared code between the client and the server
├── /assets/                          # images, css, jsons etc.
├── .eslintrc                         # es-lint configuration
├── .prettierec                       # prettier configuration
├── .gitignore                        # ignored git files and folders
├── .nvmrc                            # Force nodejs version
├── .env                              # (ignored) Can be used to override environment variables
├── index.js                          # The server's entry point
├── package.json                      # The list of 3rd party libraries and utilities
├── README.md                         # This file
```

### What's included

- [React v19](https://facebook.github.io/react/)
- [React router v6](https://github.com/ReactTraining/react-router)
- [Material-ui v5](https://github.com/mui-org/material-ui)
- [emotion](https://emotion.sh/docs/introduction)
- [Axios](https://github.com/mzabriskie/axios) (For Client/Server communication)

### Usage

- `yarn dev` - Client and server are in watch mode with source maps, opens [http://localhost:3000](http://localhost:3000)
- `yarn lint` - Runs es-lint
- `yarn build` - `dist` folder will include all the needed files, both client (Bundle) and server.
- `yarn start` - Just runs `node ./dist/server/server.js`
- `yarn start:prod` - sets `NODE_ENV` to `production` and then runs `node ./dist/server/server.js`. (Bypassing vite)

### Config

All applications require a config mechanism, for example, `SLACK_API_TOKEN`. Things that you don't want in your git history, you want a different environment to have different value (dev/staging/production). This repo uses the file `config.ts` to access all your app variables. And a `.env` file to override variable in dev environment. This file is ignored from git.

---

#### What's not included

- Server side rendering
- Redux/MobX/Zustand (State management)

---

#### Licence

This code is released as is, under MIT licence. Feel free to use it for free for both commercial and private projects. No warranty provided.
