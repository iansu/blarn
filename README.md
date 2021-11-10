# Blarn

A package manager wrapper with extra functionality. Currently supports npm and Yarn v1.

## Features

- Automatically add and remove TypeScript `@types` packages when adding or removing packages in a TypeScript project
  - Ignores "placeholder" types packages that don't do anything
- List linked and linkable packages, unlink all packages and automatically rerun install after unlinking packages
- Automatically add `run` to npm commands
- Support `add` as an alias to `install` for npm
- Support `remove` as an alias to `uninstall` for npm

## Usage

### Requirements

- You must have npm or Yarn 1 installed and available on your path

### Installation

```sh
// npm
npm install -g blarn

// yarn
yarn global add blarn
```

### Aliases

If you really want to go all in on Blarn you can alias the `yarn` and `npm` commands to `blarn`. This will allow you to run either command in a project and Blarn will automatically use the correct package manager. It also allows you to run npm commands like yarn without specifying `run`. For example you could run `npm build` instead of `npm run build`. This could be useful if you are migrating from Yarn to npm. To do this add the following aliases in your shell:

```sh
alias npm="blarn"
alias yarn="blarn"
```

### Upgrading

```sh
// npm
npm install -g blarn

// yarn
yarn global add blarn
```

### Running package manager commands

Blarn will pass all commands and arguments through to the package manager. When adding packages in a TypeScript project it will execute a second command to add any available `@types` packages as dev dependencies. When removing packages any corresponding `@types` packages will be added to the list of packages to remove.

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
1. Run `npm install`
1. Run `npm run build` or `npm run watch`
1. Run `npm start` or `bin/blarn.js`

## Acknowledgements

This project was inspired by [Yarn 2](https://yarnpkg.com/) and [Bojack Horseman](https://bojackhorseman.fandom.com/wiki/Diane_Nguyen).
