export enum SessionEventEnum {
  CONNECTION,
  CLOSE,
  MESSAGE
};

export enum StreamEventEnum {
  INITIAL,
  END,
  TIMEOUT,
  DATA
}

export const StreamEventName = {
  INITIAL: 'initial',
  END: 'end',
  TIMEOUT: 'timeout',
  DATA: 'data'
};

export const DefaultInterval = 30;
