
export declare type Collstats ={
   /**
    * Adds latency statistics to the return document.
    * If histogram is set to true, shows latency histogram information to the embedded documents in latencyStats @default false.
    */
    latencyStats?: { histograms?: boolean },
    /**
     * Adds storage statistics to the return document.
     * 
     * Specify an empty document (i.e. storageStats: {}) to use the default scale factor of 1 for the various size data. Scale factor of 1 displays the returned sizes in bytes.
     * 
     * Specify the scale factor (i.e. storageStats: { scale: <number> }) to use the specified scale factor for the various size data. For example, to display kilobytes rather than bytes, specify a scale value of 1024.
     * 
     * If you specify a non-integer scale factor, MongoDB uses the integer part of the specified factor. For example, if you specify a scale factor of 1023.999, MongoDB uses 1023 as the scale factor.
     * 
     */
    storageStats?: { scale?: number },
    /**
     * Adds the total number of documents in the collection to the return document.
     * 
     * Only present when the count: {} option is specified. Returns an error if applied to a view
     */
    count?: {},
    /**
     * Adds query execution statistics to the return document.
     * 
     * Only present when the queryExecStats: {} option is specified. Returns an error if applied to a view.
     */
    queryExecStats?: {}
}