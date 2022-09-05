import { Document } from 'mongodb'
import { TsCollection } from './connection'

export declare type FuncType = (...args: any[]) => any

export declare type MethodKeys<T> = {
  [M in keyof T]: T[M] extends FuncType ? M : never
}[keyof T]

export declare type Methods<T> = {
  [M in MethodKeys<T>]: T[M] extends FuncType ? T[M] : never
}

export const middlewareMethods = [
  // Database operations
  'insertOne',
  'insertMany',
  'bulkWrite',
  'updateOne',
  'replaceOne',
  'updateMany',
  'deleteOne',
  'deleteMany',
  'rename',
  'drop',
  'findOne',
  'find',
  'estimatedDocumentCount',
  'countDocuments',
  'distinct',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'aggregate',
  'watch',
  'mapReduce',
  'initializeUnorderedBulkOp',
  'initializeOrderedBulkOp',
  'insert',
  'update',
  'remove',
  'count',

  // house-keeping operations
  'createIndex',
  'createIndexes',
  'dropIndex',
  'dropIndexes',
  'listIndexes',
  'indexExists',
  'indexInformation',
  'indexes',
  'stats',
] as const

export type MiddlewareMethods = typeof middlewareMethods[number]

export const isMiddlewareMethod = (
  methodName: string
): methodName is MiddlewareMethods => {
  return middlewareMethods.includes(methodName as MiddlewareMethods)
}

export interface Context {
  originalMethod: (...args: any[]) => any
  methodName: MiddlewareMethods
}

export type Handler = (ctx: Context) => (...args: unknown[]) => any

type Middleware = {
  handler?: Handler
}

export const addMiddleware = <TSchema extends Document>(
  collection: TsCollection<TSchema>,
  { handler }: Middleware = {}
) => {
  if (handler) {
    middlewareMethods.forEach((methodName) => {
      Object.defineProperty(collection, methodName, {
        value: handler({
          originalMethod: collection[methodName].bind(collection),
          methodName,
        }).bind(collection),
        configurable: true,
        writable: false,
      })
    })
  }
}
