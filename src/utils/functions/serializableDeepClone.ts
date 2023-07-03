

export const serializableDeepClone = (obj:Object|Array<any>|string|number|boolean) => {
    return JSON.parse(JSON.stringify(obj))
}