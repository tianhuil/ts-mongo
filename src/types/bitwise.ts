import { Binary } from 'mongodb'

/**
 * https://www.mongodb.com/docs/manual/reference/operator/query-bitwise/ and
 * https://mongodb.github.io/node-mongodb-native/5.1/modules.html#BitwiseFilter
 */
export type WithBitwiseOperator<Field> = Field extends
  | number
  | Binary
  | ReadonlyArray<number>
  ? {
      $bitsAllClear?: Field
      $bitsAllSet?: Field
      $bitsAnyClear?: Field
      $bitsAnySet?: Field
    }
  : {}
