![GraphQL Faker logo](./docs/faker-logo-text.png)

# GraphQL Faker

[![npm](https://img.shields.io/npm/v/graphql-faker.svg)](https://www.npmjs.com/package/graphql-faker)
[![David](https://img.shields.io/david/APIs-guru/graphql-faker.svg)](https://david-dm.org/APIs-guru/graphql-faker)
[![David](https://img.shields.io/david/dev/APIs-guru/graphql-faker.svg)](https://david-dm.org/APIs-guru/graphql-faker?type=dev)
[![npm](https://img.shields.io/npm/l/graphql-faker.svg)](https://github.com/APIs-guru/graphql-faker/blob/master/LICENSE)
[![docker](https://img.shields.io/docker/build/apisguru/graphql-faker.svg)](https://hub.docker.com/r/apisguru/graphql-faker/)

Mock your future API or extend the existing API with realistic data from [faker.js](https://github.com/Marak/faker.js). **No coding required**.

All you need is to write [GraphQL IDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51). Don't worry, we will provide you with examples in our IDL editor.

In the GIF bellow we add fields to types inside real GitHub API and you can make queries from GraphiQL, Apollo, Relay, etc. and receive **real data mixed with mock data.**
![demo-gif](./docs/demo.gif)

## Status

This fork is a major extension of the [original](https://www.npmjs.com/package/graphql-faker) library. It has not yet been fully tested. Please help out!

## How does it work?

We use `@fake` directive to let you specify how to fake data. And if 60+ fakers is not enough for you, just use `@examples` directive to provide examples. Use `@sample` directive to specify number of returned array items. Add a directive to any field or custom scalar definition:

    type Person {
      name: String @fake(type: firstName)
      gender: String @examples(values: ["male", "female"])
      pets: [Pet] @sample(min: 0, max: 8, empty: 0.4)
    }

No need to remember or read any docs. Autocompletion is included!

The `@sample` directive is meant to be used for more fine grained constraints and control such as the range of the number of items to return (ie, `min` and `max` for a particular property and the chance for the list to be `empty` (where `0.4` is a 40% chance).

You can also pass an optional `config` object as the second argument to `fakeSchema` with various options for more fine-grained control. See [Customization](./Customization.md) for more details.

## Features

- 60+ different types of faked data e.g. `streetAddress`, `firstName`, `lastName`, `imageUrl`, `lorem`, `semver`
- Comes with multiple locales supported
- Runs as a local server (can be called from browser, cURL, your app, etc.)
- Interactive editor with autocompletion for directives with GraphiQL embeded
- ✨ Support for proxying existing GraphQL API and extending it with faked data
  ![Extend mode diagram](./docs/extend-mode.gif)

## Install

    npm install -g graphql-faker

or

    yarn global add graphql-faker

or run it in a Docker container, see **Usage with Docker**

## TL;DR

Mock GraphQL API based on example IDL and open interactive editor:

    graphql-faker --open

**Note:** You can specify non-existing IDL file names - Faker will use example IDL which you can edit in interactive editor.

Extend real data from SWAPI with faked data based on extension IDL:

    graphql-faker ./ext-swapi.grqphql --extend http://swapi.apis.guru

Extend real data from GitHub API with faked data based on extension IDL (you can get token [here](https://developer.github.com/early-access/graphql/guides/accessing-graphql/#generating-an-oauth-token)):

    graphql-faker ./ext-gh.graphql --extend https://api.github.com/graphql \
    --header "Authorization: bearer <TOKEN>"

## CLI Usage

    graphql-faker [options] [IDL file]

`[IDL file]` - path to file with [IDL](https://www.graph.cool/docs/faq/graphql-schema-definition-idl-kr84dktnp0/). If this argument is omited Faker uses default file name.

### Options

- `-c`, `--config` Path to JSON config file used to load config object
- `-p`, `--port` HTTP Port [default: `env.PORT` or `9002`]
- `-e`, `--extend` URL to existing GraphQL server to extend
- `-o`, `--open` Open page with IDL editor and GraphiQL in browser
- `-H`, `--header` Specify headers to the proxied server in cURL format, e.g.: `Authorization: bearer XXXXXXXXX`
- `--forward-headers` Specify which headers should be forwarded to the proxied server
- `--co`, `--cors-origin` CORS: Specify the custom origin for the Access-Control-Allow-Origin header, by default it is the same as `Origin` header from the request
- `-h`, `--help` Show help

When specifying the `[SDL file]` after the `--forward-headers` option you need to prefix it with `--` to clarify it's not another header. For example:

```
graphql-faker --extend http://example.com/graphql --forward-headers Authorition -- ./temp.faker.graphql
```

When you finish with an other option there is no need for the `--`:

```
graphql-faker --forward-headers Authorition --extend http://example.com/graphql ./temp.faker.graphql
```

Using config file `faker-config.json`

```
graphql-faker --extend http://example.com/graphql --config ./faker-config.json -- ./temp.faker.graphql
```

#### CLI config

Please note that when using the CLI, you can _not_ pass a custom `faker` or faker `sections` since these parts of the configuration require functions. The JSON config file can only contain static config data.

### Usage with Docker

    docker run -p=9002:9002 apisguru/graphql-faker [options] [IDL file]

To specify a custom file, mount a volume where the file is located to `/workdir`:

    docker run -v=${PWD}:/workdir apisguru/graphql-faker path/to/schema.idl

Because the process is running inside of the container, `--open` does not work.

### API usage

To use the API directly, use the exported `run` method, passing the relevant options as demonstrated below:

```js
import { run } from "graphql-faker";

const config = {
  sample: {
    array: {
      min: 1,
      max: 100
    }
  }
};

run({
  extendUrl: "http://example.com/graphql",
  forwardHeaders: "Authorition",
  file: "./temp.faker.graphql",
  config
});
```

Note: You can also pass the `idl` as a string to avoid having to load it from a file, such as `./temp.faker.graphql`

```js
const idl = `
  type Pet {
    name: String @fake(type:firstName)
    image: String @fake(type:imageUrl, options: {imageCategory:cats})
  }
`

run({
  extendUrl: "http://example.com/graphql",
  idl,
  // ...
}
```

## Enable modes and functionality

```js
const config = {
  enable: {
    mocking: true,
    logging: true
  },
  //...

```

# Development

```sh
yarn
npm run build:all
npm run start
```

## Dependencies

Uses [resolve-type-maps](https://github.com/kristianmandrup/resolve-type-maps) to resolve types/field to default values when directives not present

## Advanced usage

- [Faker types](./Faker-types.md)
- [Mocking](./Mocking.md)
- [Customization](./Customization.md)

## Project

- [Todo](./Todo.md)
- [Changelog](./Changelog.md)

## License

MIT
