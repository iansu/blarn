# Blarn

A Yarn wrapper with extra functionality

## Features

- Automatically add and remove TypeScript `@types` packages when adding or removing packages in a TypeScript project
- List linked and linkable packages, unlink all packages and automatically rerun Yarn after unlinking packages.

## Usage

### Requirements

- You must have Yarn 1 installed and available on your path

### Installation

```sh
// npm
npm install -g blarn

// yarn
yarn global add blarn
```

### Upgrading

```sh
// npm
npm install -g blarn

// yarn
yarn global upgrade blarn --latest
```

### Running Yarn commands

Blarn will pass all commands and arguments through to Yarn. When adding packages in a TypeScript project it will execute a second `yarn add` command to add any available `@types` packages as dev dependencies. When removing packages any corresponding `@types` packages will be added to the list of packages to remove.

### Examples

#### Adding packages

`blarn add yargs`

If you run this command in a TypeScript project `yargs` will be installed as a dependency and `@types/yargs` will be installed as a dev dependency. If you run this command in a JavaScript project only `yargs` will be installed as a dependency.

### Removing packages

`blarn remove yargs`

If you run this command in a TypeScript project and `@types/yargs` exists in `package.json` both `yargs` and `@types/yargs` will be removed. If you run this command in a JavaScript project only `yargs` will be removed.

### Showing linked packages in a project

`blarn linked`

### Showing all packages available to be linked

`blarn linkable`

### Unlinking all linked packages in a project

`blarn unlink-all`

## Contributing

### Running locally

1. Fork and clone this repo
1. Run `yarn`
1. Run `yarn build` or `yarn watch`
1. Run `yarn start` or `bin/blarn.js`

## Acknowledgements

This project was inspired by [Yarn 2](https://yarnpkg.com/) and [Bojack Horseman](https://bojackhorseman.fandom.com/wiki/Diane_Nguyen).
