export enum SessionEventEnum {
  CONNECTION,
  CLOSE,
  MESSAGE
};

export enum TimerEventEnum {
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
