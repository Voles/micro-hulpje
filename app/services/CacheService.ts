import storage from 'node-persist'
import * as Q from "q";

class CacheService {
    private static _instance: CacheService = new CacheService()
    private store: Q.Promise<any>

    // TODO: investigate conventional way to implement Singleton pattern in TypeScript
    constructor() {
        CacheService._instance = this
        const second = 1000
        const minute = 60 * second
        this.store = storage.init({ ttl: 5 * minute });
    }

    static getInstance(): CacheService {
        return CacheService._instance
    }

    setItem(key, value): Promise<string> {
        return new Promise(resolve => {
            storage
                .setItem(key, value)
                .then(result => {
                    resolve(result)
                })
        })
    }

    getItem(key: string): Promise<string> {
        return new Promise(resolve => {
            return storage
                .getItem(key)
                .then(value => resolve(value))
        })
    }

    getOrSet(key: string, cb: () => Promise<string>): Promise<string> {
        return this
            .getItem(key)
            .then(value => {
                if (!value) {
                    return cb()
                        .then(result => {
                            return this
                                .setItem(key, result)
                                .then(() => result)
                        })
                } else {
                    return value
                }
            })
    }
}

export default CacheService
