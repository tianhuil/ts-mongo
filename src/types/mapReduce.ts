import { Document, MapReduceOptions, ObjectId } from "mongodb";
import { TsFilter } from "./filter";
import { TsProjection } from "./projection";
import { TsSort } from "./sort";
import { RemodelType } from "./util";

export declare type TsMapReduceOptions<
  Tkey extends ObjectId,
  TSchema extends Document
> = RemodelType<
  {
    sort?: TsSort<TSchema>;
    projection?: TsProjection<TSchema>;
    query?: TsFilter<TSchema>;

  },
  MapReduceOptions<Tkey, TSchema>
>
