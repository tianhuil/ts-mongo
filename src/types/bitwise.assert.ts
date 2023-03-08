import { Binary } from 'mongodb'
import * as ta from 'type-assertions'
import { WithOperator } from './filter'

// test WithOperator number
ta.assert<ta.Extends<{ $bitsAllClear: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $bitsAllSet: 4 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $bitsAnyClear: 6 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $bitsAnySet: 8 }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllClear: 'a' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllSet: 'b' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnyClear: 'c' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnySet: 'd' }, WithOperator<number>>>>()

// test WithOperator binary
const binary1 = { $bitsAllClear: new Binary([0, 0, 1, 0, 0, 0, 1]) }
const binary2 = { $bitsAllSet: new Binary([1, 1, 1, 1]) }
const binary3 = { $bitsAnyClear: new Binary([0, 1, 0, 1, 0, 1, 0, 1, 0]) }
const binary4 = { $bitsAnySet: new Binary([0, 0, 0, 0, 0, 0]) }
ta.assert<ta.Extends<typeof binary1, WithOperator<Binary>>>()
ta.assert<ta.Extends<typeof binary2, WithOperator<Binary>>>()
ta.assert<ta.Extends<typeof binary3, WithOperator<Binary>>>()
ta.assert<ta.Extends<typeof binary4, WithOperator<Binary>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllClear: 'hi' }, WithOperator<Binary>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllSet: 'hi' }, WithOperator<Binary>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnyClear: 'hi' }, WithOperator<Binary>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnySet: 'hi' }, WithOperator<Binary>>>>()

// Test WithOperator string
ta.assert<ta.Not<ta.Extends<typeof binary1, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<typeof binary2, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<typeof binary3, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<typeof binary4, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllClear: 2 }, WithOperator<string>>>>()

// Test WithOperator array
ta.assert<ta.Extends<{ $bitsAllClear: [1, 2, 3] }, WithOperator<number[]>>>()
ta.assert<ta.Extends<{ $bitsAllSet: [1, 2, 3] }, WithOperator<number[]>>>()
ta.assert<ta.Extends<{ $bitsAnyClear: [1, 2, 3] }, WithOperator<number[]>>>()
ta.assert<ta.Extends<{ $bitsAnySet: [1, 2, 3] }, WithOperator<number[]>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllClear: 'hi' }, WithOperator<number[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAllSet: 'hi' }, WithOperator<number[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnyClear: 'hi' }, WithOperator<number[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $bitsAnySet: 'hi' }, WithOperator<number[]>>>>()
