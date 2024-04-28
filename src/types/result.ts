export type Result<OkType, ErrorType> = {
    wasResultSuccessful: true;
    okValue: OkType
} | {
    wasResultSuccessful: false;
    errorValue: ErrorType;
} 

export function ok<OkType>(okValue: OkType)
{
    return {
        wasResultSuccessful: true as const,
        okValue
    };
}

export async function okAsync<OkType>(okValue: Promise<OkType>)
{
    return {
        wasResultSuccessful: true as const,
        okValue: (await okValue)
    };
}

export function error<ErrorType>(errorValue: ErrorType)
{
    return {
        wasResultSuccessful: false as const,
        errorValue
    };
}

export type ExtractOkType<T> = T extends Result<infer OkType, unknown> ? {wasResultSuccessful: true, okValue: OkType} : never;
export type ExtractErrorType<T> = T extends Result<unknown, infer ErrorType> ? {wasResultSuccessful: false, errorValue: ErrorType} : never;
