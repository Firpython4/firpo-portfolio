export function promiseFullfilledPredicate<T> (promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T>
{
    return promise.status === "fulfilled";
}

export function promiseRejectedPredicate<T> (promise: PromiseSettledResult<T>): promise is PromiseRejectedResult
{
    return promise.status === "rejected";
}

export function valueMapper<T>(from: {value: T})
{
    return from.value
}

