function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
}
export function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj)) {
        return obj
    }
    if (hash.has(obj)) return hash.get(obj)
    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [] : {}
    hash.set(obj, cloneObj)
    let result = Object.keys(obj).map(key => {
        return {
            [key]: deepClone(obj[key], hash)
        }
    })
    return Object.assign(cloneObj, ...result)
}

export const repeat = (str, times) => (new Array(times + 1)).join(str);

export const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;

//使用新的性能API可以获得更好的精度（如果可用）
export const timer = typeof performance !== `undefined` && typeof performance.now === `function` ? performance : Date;