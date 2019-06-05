export enum SessionEventType {
  CONNECTION,
  CLOSE,
  MESSAGE
};

export enum TimerEventType {
  INITIAL,
  END,
  TIMEOUT,
  DATA
}

export const TimerEventName = {
  INITIAL: 'initial',
  END: 'end',
  TIMEOUT: 'timeout',
  DATA: 'data'
};

export const TimerInterval = 100;
