export interface ApiResponse<ResultsType> {
    results: ResultsType,
    status: string,
    request_id: string,
    count: number,
    next_url: string | null
}
