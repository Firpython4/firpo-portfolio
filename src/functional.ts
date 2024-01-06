import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";

export function mapMap<KeyType, ValueType, NewKeyType, NewValueType>(map: Map<KeyType, ValueType>, mapper: (key: KeyType, value: ValueType) => [NewKeyType, NewValueType])
{
    const newMap = new Map<NewKeyType, NewValueType>();
    for (const [key, value] of map)
    {
        const result = mapper(key, value);
        newMap.set(result[0], result[1]);
    }

    return newMap;
}

export async function mapMapAsync<KeyType, ValueType, NewKeyType, NewValueType>(map: Map<KeyType, ValueType>, mapper: (key: KeyType, value: ValueType) => Promise<[NewKeyType, NewValueType]>)
{
    const newMap = new Map<NewKeyType, NewValueType>();
    const promises: Promise<[NewKeyType, NewValueType]>[] = [];
    for (const [key, value] of map)
    {
        const result = mapper(key, value);
        promises.push(result);
    }

    const all = await Promise.allSettled(promises);
    if (all.filter(promiseRejectedPredicate).length > 0)
    {
        throw new Error("Some map promises were rejected");
    }

    const values = all.filter(promiseFullfilledPredicate).map(valueMapper)
    for (const [key, value] of values)
    {
        newMap.set(key, value);
    }

    return newMap;
}
