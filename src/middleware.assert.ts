import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsCollection } from './collection'
import {
  FuncType,
  Handler,
  MethodKeys,
  Methods,
  Middleware,
  MiddlewareMethods,
} from './middleware'

type TSchema<T> = { a: () => T; b: (_: T) => string; c: number; _id: ObjectId }

// Test MethodKeys and Methods
ta.assert<ta.Equal<MethodKeys<TSchema<number>>, 'a' | 'b'>>()
ta.assert<
  ta.Equal<
    Methods<TSchema<number>>,
    { a: () => number; b: (_: number) => string }
  >
>()

// Test FuncType
ta.assert<ta.Not<ta.Extends<string, FuncType>>>()
ta.assert<ta.Not<ta.Extends<{}, FuncType>>>()

// Test Handler and Middleware
ta.assert<ta.Extends<Handler, FuncType>>()
ta.assert<ta.Extends<Middleware['handler'], FuncType | undefined>>()

// Test MiddlewareMethods
ta.assert<
  ta.Extends<MiddlewareMethods, MethodKeys<TsCollection<TSchema<string>>>>
>()
