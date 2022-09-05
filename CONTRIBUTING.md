# Contributing

## Commands

When developing, run the following from the root-level directory:

```shell
yarn
```

**Lint code** - It will only run lint and not fix

```shell
yarn lint
```

**Lint and fix code** - It will run lint and fix code

```shell
yarn lint:fix
```

**Build Typescript** - Will validate and build typescript

```shell
yarn lint:ts
```

**Build** - This will build all libraries.

```shell
yarn build
```

**Prettify** - Run prettier formater on all packages.

```shell
yarn prettify
```

**Test** - This will run tests.

```shell
yarn test
```

**Test coverage** - This will run all tests and report test coverage.

```shell
yarn test:cov
```

**Test no coverage** - This will run all tests without test coverage.

```shell
yarn test:nocov
```

## Coding style

All the JavaScript code in this project conforms to the [prettier](https://github.com/prettier/prettier) coding style. Code is automatically prettified upon commit using precommit hooks.

## Documentation

We use [storybook](https://storybook.js.org/) to build our documentation. To run documentation locally, run:

```bash
yarn build-storybook
yarn storybook
```

Documentation will be served on [localhost:6006](http://localhost:6006).


## Releasing

[Semantic release](https://github.com/semantic-release/semantic-release) is being used for versioning and packaging purposes.

Make sure commit messages follow the [commit git message syntax](./gitmessage)

All PR's run a CI check that need to pass and require at least 1 approval. Once approved and merged into master.

[Semantic release](https://github.com/semantic-release/semantic-release) will check the commit history on the approved PR. When the PR is merged into master, it will determine
the version based on commit message syntax. 
- A release/v+.+.+ branch will be created 
- A github npm package will be published. 
- The storybook docs will be deployed and updated.
- To deploy to npm registry the [npm github action](https://github.com/trixtateam/trixta-js/actions/workflows/npm.yml) must be run manually.

### Releasing docs

Docs are automatically published using publish-storybook workflow upon a new Release.

