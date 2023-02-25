import {Binary} from "mongodb";

/**
 * https://www.mongodb.com/docs/manual/reference/operator/query-bitwise/
 */
export type WithBitwiseOperator<Field> = Field extends number | Binary | ReadonlyArray<number> ? {
    $bitsAllClear?: Field;
    $bitsAllSet?: Field;
    $bitsAnyClear?: Field;
    $bitsAnySet?: Field;
} : {}
