# TS Mongo

[![Node.js CI Lint](https://github.com/tianhuil/ts-mongo/actions/workflows/test.yaml/badge.svg)](https://github.com/tianhuil/ts-mongo/actions/workflows/test.yaml)

Strongly-typed Mongo native driver.

## Getting Started

To install, run one of the following

```sh
npm install @tianhuil/ts-mongo
yarn add @tianhuil/ts-mongo
pnpm add @tianhuil/ts-mongo
```

## Philosophy

Mongodb's node-native driver and mongoose both provide poor typescript support.  They need to support every query and update that is allowed by the spec, which is difficult to encapsulate in typescript.  The result is promiscuous typesafety that allows even unsafe queries and input values to pass typecheck.

We re-type the node-native driver to provide uptight type-safety.  We choose to have type-safety disallow queries that are hard to type or which we deem poor practice.  While there are plenty of valid mongo queries our type checking disallows, our aim is to minimize bad queries that pass type checking.

### Getting Started

To create a type-safe drop-in replacement

```ts
import { mkTsCollection } from '@tianhuil/ts-mongo'

const collection = mkTsCollection<TSchema>(db, 'collection-name')
const result = await collection.findOne(...) // now with better type safety
const unsafeResult = await collection.unsafe.findOne(...) // with old types
```

### Example

Assume you have a collection type of

```ts
{ admin: { name: string; email: string }[] }
```

The mongo native driver allows queries of the form

```ts
{ `admin.2.name`: 'Joe' }
```

to select the second value in the array `admin`.  In the native driver, this is accomplished via type template-literal typing

```ts
{ [x: `admin.${number}.name`]?: string }
```

Unfortunately, this is overly promiscuous and allows any field, i.e. this query type checks:

```ts
{ 'not-a-field': 'bad query!' }
```

By default, we only allow you to select the 0'th element.  This solves the problem template literal problem.

- As a concession, `Filter` takes an optional second argument (defaults to 0), which can be made `number` for those seeking the original promiscuous behavior.
- In general, we believe it's not typesafe to select arbitrarily into an array so allowing an arbitrary number is probably not great programming practice.

## Converter

Many middleware functions are handled by the converter, which is like a type-safe middleware that can transform the type of the collection.  For example, `convertToTimeCollection` implements `createdAt` and `updatedAt` fields on a collection.  See `convertReadWriteCollection`.

## How to fix bugs in TsMongo

When using the code, you may notice mistakes in TsMongo's typing behavior, use the corresponding assert file (which is like unit testing for types) and add an assert case to cover your newly-discovered bug or new feature.  For example:

1. A bug in `.sort` will be in the type `TsSort`.
2. Build a test case in the assert file `sort.assert.ts`.
3. Then investigate the original file `sort.ts` and hack things until you pass testing.  Red underlines appear in VSCode to tell you if the typing doesn't work.

## Development

To use a local version of ts-mongo you are developing while building another app (let's call it `foo`), navigate to `foo` and run the following command (assume the two folders are siblings)
```bash
cd ./foo
npm link ../ts-mongo
npm install # install and @tianhuil/ts-mongo will point to local version at ../ts-mongo
```

When you

## Release

To release, run the following to check on the `main` branch:

```bash
# commit all your changes
npm run build # runs checks on prebuild and builds package (must use npm)
pnpm np --no-tests --any-branch --preview # make sure this is what you want
pnpm np --no-tests # deploy
```
