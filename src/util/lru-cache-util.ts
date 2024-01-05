import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LRUCache } from 'lru-cache';

@Injectable()
export class LruCacheUtil {
  private cache;

  constructor(private configService: ConfigService) {
    const options = {
      max: parseInt(configService.get('CACHE_MAX')),

      // for use with tracking overall storage size
      maxSize: parseInt(configService.get('CACHE_MAX_SIZE')),
      // sizeCalculation: (value, key) => {
      //   return 1;
      // },

      // for use when you need to clean up something when objects
      // are evicted from the cache
      dispose: (value, key) => {
        // freeFromMemoryOrWhatever(value);
        console.log(`dispose key: ${key}  /  value: ${value}`);
      },

      // how long to live in ms
      ttl: parseInt(configService.get('CACHE_TTL')),

      // return stale items before removing from cache?
      allowStale: false,

      updateAgeOnGet: false,
      updateAgeOnHas: false,

      // async method to use for cache.fetch(), for
      // stale-while-revalidate type of behavior
      fetchMethod: async (key, staleValue, { options, signal, context }) => {},
    };
    this.cache = new LRUCache(options);
  }

  public set(key: any, value: any) {
    this.cache.set(key, value);
  }

  public get(key: any) {
    return this.cache.get(key);
  }

  public delete(key: any) {
    this.cache.delete(key);
  }

  public clear() {
    this.cache.clear();
  }
}
