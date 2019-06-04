// TODO: add some function or MiddlewareContext could be replaced by map
export class MiddlewareContext {
  private value: Map<any, any>;

  constructor(initState: any) {
    this.value = new Map(Object.entries(initState));
  }

  set(key: any, value: any): void {
    this.value.set(key, value);
  }

  get(key: any): any {
    return this.value.get(key);
  }
}
