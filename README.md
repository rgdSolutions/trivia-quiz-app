# trivia-quiz-app
A tiny, full-stack trivia quiz app to demo React / Redux / Express / MongoDB

## How to Demo the App
To demo the app, you need to have the following dependencies installed on your system:
- [Node.js v22](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

Once all three are installed, run this command in your terminal:
```
yarn demo
```
> **Note**: The `MAX_NUMBER_OF_CATEGORIES` value can be changed in the `.env` file.

## Overview of Development

#### Boilerplate Usage
This git repository was generated from the [fullstack-typescript](https://github.com/gilamran/fullstack-typescript) boilerplate template to get up and running quickly. This boilerplate was chosen after a brief Google search to compare several available boilerplates as this one comes pre-loaded with:
- [TypeScript](https://www.typescriptlang.org/)
- [React v19](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Material UI](https://mui.com/)
- [Express v5](https://expressjs.com/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)

#### Additional Dependencies
Besides the dependencies that came with the boilerplate, I added these:
- [Mongoose](https://mongoosejs.com/)
-
-

#### Generative AI Usage
Because I use [Cursor](https://www.cursor.com/en) as my go-to IDE, there is always some level of generative AI assistance in the background to populate repetetive code like database schemas, api endpoints, redux slices, and Jest test cases. Outside of the Cursor IDE, no other generative AI tools were used.

## Folder Structure
```
src/
  client/           # strictly FE code like React and Redux
    components/     # React components
  scripts/          # miscellaneous scripts like seeding the db
  server/           # strictly BE code like the Express API
  shared/           # code shared by both BE and FE like types
```