/**
 * Generic response format for API requests that return a count and result list
 */
export interface ApiCountedResponse<ResultsType> {
    count: number,
    result: ResultsType,
}
