export type cancelRequestFunctionType = (reason?: string) => void;

export interface cancellableRequestType {
  responsePromise: Promise<unknown>;
  cancelRequest: cancelRequestFunctionType;
}
