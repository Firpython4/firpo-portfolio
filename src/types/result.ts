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

export function error<ErrorType>(errorType: ErrorType)
{
    return {
        wasResultSuccessful: false as const,
        ...errorType
    };
}

