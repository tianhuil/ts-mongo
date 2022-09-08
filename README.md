# TS Mongo
Strongly-typed Mongo native driver.

## Philosophy
Mongodb's node-native driver and mongoose both provide poor typescript support.  They need to support every query and update that is allowed by the spec, which is difficult to encapsulate in typescript.  The result is promiscuous typesafety that allows even unsafe queries and input values to pass typecheck.

We re-type the node-native driver to provide uptight type-safety.  We choose to have type-safety disallow queries that are hard to type or which we deem poor practice.  While there are plenty of valid mongo queries our type checking disallows, our aim is to minimize bad queries that pass type checking.

### Getting Started
To create a type-safe drop-in replacement
```ts
const collection = mkTsCollection(db, 'colleciton-name')
const result = await colleciton.findOne(...) // now with better type safety
const unsafeResult = await colleciton.unsafe.findOne(...) // with old types
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

## Roadmap
- Aggregation (still incomplete)
- Mapreduce
- Geography Operators
- Bit Operators
