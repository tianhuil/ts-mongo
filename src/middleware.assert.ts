import * as ta from 'type-assertions'
import { TsCollection } from './connection'
import {
  FuncType,
  Handler,
  MethodKeys,
  Methods,
  Middleware,
  MiddlewareMethods,
} from './middleware'

type TSchema<T> = { a: () => T; b: (_: T) => string; c: number }

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
ta.assert<ta.Extends<Handler<TSchema<string>, 'aggregate'>, FuncType>>()
ta.assert<
  ta.Extends<Middleware<TSchema<string>, MiddlewareMethods>, FuncType>
>()

// Test MiddlewareMethods
ta.assert<
  ta.Extends<MiddlewareMethods, MethodKeys<TsCollection<TSchema<string>>>>
>()
