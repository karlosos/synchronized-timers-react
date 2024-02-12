import { useEffect, useRef } from "react";

type IntervalFn = () => void;

// Taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (fn: IntervalFn, delay: number | null) => {
  const callback = useRef<IntervalFn>(fn);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        callback.current();
      }, delay);

      return () => {
        clearInterval(id);
      };
    } else {
      return;
    }
  }, [delay]);
};
