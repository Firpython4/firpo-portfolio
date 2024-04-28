export type Result<OkType, ErrorType> = {
    wasResultSuccessful: true;
} & OkType | {
    wasResultSuccessful: false;
} & ErrorType

export function ok<OkType>(okValue: OkType)
{
    return {
        wasResultSuccessful: true as const,
        ...okValue
    };
}

export async function okAsync<OkType>(okValue: Promise<OkType>)
{
    return {
        wasResultSuccessful: true as const,
        ...(await okValue)
    };
}

export function error<ErrorType>(errorType: ErrorType)
{
    return {
        wasResultSuccessful: false as const,
        ...errorType
    };
}

export type ExtractOkType<T> = T extends Result<infer OkType, unknown> ? OkType & {wasResultSuccessful: true} : never;
export type ExtractErrorType<T> = T extends Result<unknown, infer ErrorType> ? ErrorType & {wasResultSuccessful: false} : never;
