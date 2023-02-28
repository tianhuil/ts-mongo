import { Document, MapReduceOptions, ObjectId } from 'mongodb';
import { TsFilter } from './filter';
import { TsSort } from './sort';

// MapReduceOptions output type contains inline, which probably should be string?
export type MapReduceOutput =
    | string
    | { inline: 1 }
    | { replace: string }
    | { reduce: string }
    | { merge: string };

export type TsOmitMapReduction = Omit<
    MapReduceOptions,
    'out' | 'query' | 'sort'
>;

export interface TsMapReduceOptions<TSchema extends Document, Key = ObjectId>
    extends TsOmitMapReduction {
    out?: MapReduceOutput;
    query?: TsFilter<TSchema>;
    sort: TsSort<TSchema>;
}
