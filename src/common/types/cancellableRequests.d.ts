export type cancelRequestFunctionType = (reason?: string) => void;

export interface cancellableRequestBase {
  responsePromise: Promise<unknown>;
  cancelRequest: cancelRequestFunctionType;
}

export interface cancellableRequestClassType extends cancellableRequestBase {
  then: (callback: (response: unknown) => void) => Promise<unknown>;
  catch: (callback: (err?: unknown) => void) => Promise<unknown>;
  finally: (callback: () => void) => Promise<unknown>;
}
