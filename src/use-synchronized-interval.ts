import { useEffect, useRef } from 'react';

type IntervalFn = () => void;
type Callback = React.MutableRefObject<IntervalFn>;
type Bucket = {
  delay: number;
  callbacks: Callback[];
  interval: number;
};
type Buckets = Record<number, Bucket>;

const buckets: Buckets = {};

const setupBucket = (delay: number): Bucket => {
  let bucket = buckets[delay];
  if (!bucket) {
    bucket = {
      callbacks: [],
      delay,
      interval: setInterval(() => {
        bucket.callbacks.forEach(f => {
          f.current();
        });
      }, delay),
    };
    buckets[delay] = bucket;
  }
  return bucket;
};

const addToIntervalBucket = function(delay: number, callback: Callback) {
  const bucket = setupBucket(delay);
  bucket.callbacks = [...bucket.callbacks, callback];
};

const removeFromIntervalBucket = function(delay: number, callback: Callback) {
  const bucket = setupBucket(delay);
  bucket.callbacks = bucket.callbacks.filter(c => c !== callback);
  if (bucket.callbacks.length === 0) {
    clearInterval(bucket.interval);
    delete buckets[delay];
  }
};

export const useSynchronizedInterval = (
  fn: IntervalFn,
  delay: number | null
) => {
  const callback = useRef<IntervalFn>(fn);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    if (delay !== null) {
      addToIntervalBucket(delay, callback);

      return () => {
        removeFromIntervalBucket(delay, callback);
      };
    } else {
      return;
    }
  }, [delay]);
};