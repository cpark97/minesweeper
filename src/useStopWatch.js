import { useReducer, useRef, useCallback, useState } from "react";

function stopWatchReducer(state, action) {
  switch(action) {
    case 'RESET':
      if (state.state === 'RESET') {
        return state;
      }
      return {state: 'RESET', elapsed: 0, last: 0};
    
    case 'RESUME':
      if (state.state === 'RESUMED') {
        return state;
      }
      return {state: 'RESUMED', elapsed: state.elapsed, last: Date.now()};

    case 'UPDATE':
      if (state.state !== 'RESUMED') {
        return state;
      }
      else {
        const now = Date.now();
        return {state: 'RESUMED', elapsed: state.elapsed + (now - state.last), last: now};
      }

    case 'PAUSE':
      if (state.state !== 'RESUMED') {
        return state;
      }
      else {
        const now = Date.now();
        return {state: 'PAUSED', elapsed: state.elapsed + (now - state.last), last: now};
      }
  }

  throw new Error('stopWatchReducer: action error');
}

export function useStopWatch() {
  const [state, dispatch] = useReducer(stopWatchReducer, {state: 'RESET', elapsed: 0, last: 0});
  const intervalID = useRef(0);

  const reset = useCallback(() => {
    if (intervalID.current > 0) {
      clearInterval(intervalID.current);
      intervalID.current = 0;
    }
    dispatch('RESET');
  }, []);
  const resume = useCallback(() => {
    if (intervalID.current > 0) {
      return;
    }
    dispatch('RESUME');
    intervalID.current = setInterval(
      () => {
        dispatch('UPDATE');
      },
      1000
    );
  }, []);
  const pause = useCallback(() => {
    if (intervalID === 0) {
      return;
    }
    clearInterval(intervalID.current);
    intervalID.current = 0;

    dispatch('PAUSE');
  }, []);

  return {state: state.state, elapsed: state.elapsed, reset, resume, pause};
}

function getRoughStopWatchState(elapsedSeconds, intervalID) {
  if (intervalID > 0) {
    return 'RESUMED';
  }
  if (elapsedSeconds > 0) {
    return 'PAUSED';
  }
  return 'RESET';
}

export function useRoughStopwatch() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalID = useRef(0);

  const state = getRoughStopWatchState(elapsedSeconds, intervalID.current);
  
  const reset = useCallback(() => {
    if (intervalID.current > 0) {
      clearInterval(intervalID.current);
      intervalID.current = 0;
    }
    setElapsedSeconds(0);

  }, [setElapsedSeconds, intervalID]);

  const resume = useCallback(() => {
    if (intervalID.current > 0) {
      return;
    }
    intervalID.current = setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);
  }, [setElapsedSeconds, intervalID]);

  const pause = useCallback(() => {
    if (intervalID.current > 0) {
      clearInterval(intervalID.current);
      intervalID.current = 0;
    }
  }, [intervalID]);

  return {elapsedSeconds, state, reset, resume, pause};
}