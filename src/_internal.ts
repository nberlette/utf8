// deno-lint-ignore-file no-explicit-any
// deno-lint-ignore no-var
export var undefined: undefined;

declare const global: typeof globalThis | undefined;
declare const root: typeof globalThis | undefined;
declare const window: typeof globalThis | undefined;
declare const self: typeof globalThis | undefined;

export const $global: typeof globalThis = (() => {
  try {
    if (typeof globalThis === "object") return globalThis;
    return (0, eval)("this");
  } catch {
    if (typeof window === "object") return window;
    if (typeof self === "object") return self;
    if (typeof global === "object") return global;
    if (typeof root === "object") return root;
    if (typeof this === "object") return this;
    // ewww
    throw "Unable to locate global `this`";
  }
})();

type UncurryThis = {
  <T, A extends readonly unknown[], R>(
    fn: (this: T, ...args: A) => R,
    thisArg?: T,
  ): [T] extends [never] ? (thisArg: unknown, ...args: A) => R
    : (thisArg: T, ...args: A) => R;
};

type Uncurry<T, This = void> = T extends
  (this: infer ThisArg, ...args: infer A) => infer R
  ? [This] extends [void] ? (thisArg: ThisArg, ...args: A) => R
  : (thisArg: This, ...args: A) => R
  : T extends (...args: infer A) => infer R
    ? (thisArg: [This] extends [void] ? unknown : This, ...args: A) => R
  : never;

type UncurryGetter<T, This = void> = T extends { get(): infer R }
  ? UncurryGetter<R, This>
  : [This] extends [void] ? UncurryGetter<T, unknown>
  : (thisArg: This) => T;

type ToValue<T, K extends PropertyKey, U extends boolean = false> = K extends
  keyof T ? Exclude<T[K], undefined> | ([U] extends [true] ? undefined : never)
  : unknown;

export type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor
  | (typeof globalThis extends { Float16Array: infer F } ? F : never);

export type TypedArray = InstanceType<TypedArrayConstructor>;

type TypedArrayToStringTag = TypedArray[typeof Symbol.toStringTag];

type TypedArrayFromTag<T extends TypedArrayToStringTag> = TypedArray extends
  infer A extends TypedArray ? A extends { [Symbol.toStringTag]: T } ? A : never
  : never;

export function isTypedArray<
  T extends TypedArrayToStringTag = TypedArrayToStringTag,
>(
  it: unknown,
  type?: T | undefined,
): it is TypedArrayFromTag<T> {
  try {
    return TypedArrayPrototypeGetToStringTag(it as TypedArray) === type;
  } catch {
    return false;
  }
}

export const Object: typeof globalThis.Object = $global.Object;
export const ObjectGetPrototypeOf = Object.getPrototypeOf;
export const ObjectDefineProperty = Object.defineProperty;
export const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Function = $global.Function;
const FunctionPrototype = Function.prototype;
const { bind, call } = FunctionPrototype;

const uncurryThis: UncurryThis = (fn) => {
  const bound = bind.call(call, fn);
  ObjectDefineProperty(bound, "name", { value: fn.name });
  return bound;
};

const FunctionPrototypeBind = uncurryThis(bind);

function uncurryGetter<T, K extends keyof T>(
  o: T,
  p: K,
): UncurryGetter<T[K], T> {
  return uncurryThis(lookupGetter(o, p)) as unknown as UncurryGetter<T[K], T>;
}

function lookupGetter<
  T,
  K extends PropertyKey = keyof T,
  U extends boolean = false,
>(
  o: T,
  p: K,
  _allowUndefined?: U,
): () => ToValue<T, K, U> {
  return ObjectGetOwnPropertyDescriptor(o, p)?.get ?? (() => undefined);
}

function bindAndRename<T extends (this: This, ...a: any) => any, This = void>(
  fn: T,
  thisArg?: This,
  name = fn.name,
): T {
  const bound = FunctionPrototypeBind(fn, thisArg);
  ObjectDefineProperty(bound, "name", { value: name });
  return bound;
}

export function gracefulDefine<T extends object, K extends PropertyKey, V>(
  target: T,
  key: K,
  value: V,
): asserts target is T & { [P in K]: P extends keyof T ? T[P] : V } {
  if (!(key in target && target[key as K & keyof T] !== value)) {
    if (typeof value === "function" && typeof key === "string") {
      // ensure function names are preserved when minified etc.
      ObjectDefineProperty(value, "name", { value: key });
    }
    ObjectDefineProperty(target, key, {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}

export const toString = uncurryThis(Object.prototype.toString);

export const Error: typeof globalThis.Error = $global.Error;
export const TypeError: typeof globalThis.TypeError = $global.TypeError;
export const RangeError: typeof globalThis.RangeError = $global.RangeError;
export const ReferenceError: typeof globalThis.ReferenceError =
  $global.ReferenceError;

export const Array: typeof globalThis.Array = $global.Array;
export const Symbol: typeof globalThis.Symbol = $global.Symbol;

export const ArrayBuffer: typeof globalThis.ArrayBuffer = $global.ArrayBuffer;
export const ArrayBufferIsView = ArrayBuffer.isView;
export const ArrayBufferPrototypeGetByteLength = uncurryGetter(
  ArrayBuffer.prototype,
  "byteLength",
);

export const SharedArrayBuffer: typeof globalThis.SharedArrayBuffer =
  $global.SharedArrayBuffer;
export const SharedArrayBufferPrototypeGetByteLength = uncurryGetter(
  SharedArrayBuffer.prototype,
  "byteLength",
);

export const Uint8Array: typeof globalThis.Uint8Array = $global.Uint8Array;
export const Uint8ArrayPrototypeSlice: Uncurry<
  typeof Uint8Array.prototype.slice,
  Uint8Array
> = uncurryThis(Uint8Array.prototype.slice);
export const Uint8ArrayPrototypeSubarray: Uncurry<
  typeof Uint8Array.prototype.subarray,
  Uint8Array
> = uncurryThis(Uint8Array.prototype.subarray);

export const TypedArray: TypedArrayConstructor = ObjectGetPrototypeOf(
  Uint8Array,
);
export const TypedArrayPrototype: InstanceType<TypedArrayConstructor> =
  TypedArray?.prototype! as InstanceType<TypedArrayConstructor>;
export const TypedArrayPrototypeGetToStringTag: {
  (target: unknown): TypedArrayToStringTag | undefined;
} = uncurryGetter(TypedArrayPrototype, Symbol.toStringTag) as any;

export const TypedArrayPrototypeSubarray: Uncurry<
  typeof TypedArrayPrototype.subarray,
  typeof TypedArrayPrototype
> = uncurryThis(TypedArrayPrototype.subarray as any) as any;

export const String: typeof globalThis.String = $global.String;
export const StringFromCharCode: typeof String.fromCharCode =
  String.fromCharCode;
export const StringPrototype: typeof String.prototype = String.prototype;
export const StringPrototypeCharCodeAt: Uncurry<
  typeof String.prototype.charCodeAt,
  string
> = uncurryThis(StringPrototype.charCodeAt);
export const StringPrototypeReplace: Uncurry<
  typeof String.prototype.replace,
  string
> = uncurryThis(StringPrototype.replace);
export const StringPrototypeSlice: Uncurry<
  typeof String.prototype.slice,
  string
> = uncurryThis(StringPrototype.slice);
export const StringPrototypeCodePointAt: Uncurry<
  typeof String.prototype.codePointAt,
  string
> = uncurryThis(StringPrototype.codePointAt);
export const StringPrototypeToLowerCase: Uncurry<
  typeof String.prototype.toLowerCase,
  string
> = uncurryThis(StringPrototype.toLowerCase);
export const StringPrototypeTrim: Uncurry<
  typeof String.prototype.trim,
  string
> = uncurryThis(StringPrototype.trim);

export const Promise: typeof globalThis.Promise = $global.Promise;
export const PromiseResolve = bindAndRename(Promise.resolve, Promise);
export const PromiseReject = bindAndRename(Promise.reject, Promise);

export const TransformStream: typeof globalThis.TransformStream =
  $global.TransformStream || function TransformStream() {
    throw new TypeError("TransformStream is not supported in this environment");
  };

export type BufferSource = ArrayBufferLike | ArrayBufferView;

export function getCodePoint(input: string, index: number): number {
  const first = StringPrototypeCharCodeAt(input, index);
  if (first >= 0xd800 && first <= 0xdbff) {
    const second = StringPrototypeCharCodeAt(input, index + 1);
    if (second >= 0xdc00 && second <= 0xdfff) {
      return ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
    }
  }
  return first;
}

export function utf8BytesNeeded(codePoint: number): number {
  if (codePoint <= 0x7f) return 1;
  if (codePoint <= 0x7ff) return 2;
  if (codePoint <= 0xffff) return 3;
  return 4;
}

export function normalizeEncoding(label: string): string {
  let encoding = StringPrototypeToLowerCase(label);
  encoding = StringPrototypeTrim(encoding);
  if (encoding === "utf8" || encoding === "utf-8") return "utf-8";
  throw new TypeError(`The encoding label provided ('${label}') is invalid.`);
}

export function toUint8Array(input?: BufferSource | null): Uint8Array {
  if (input == null) {
    return new Uint8Array();
  } else if (isTypedArray(input, "Uint8Array")) {
    return input;
  } else if (ArrayBufferIsView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  } else {
    try {
      SharedArrayBufferPrototypeGetByteLength(input as SharedArrayBuffer);
      return new Uint8Array(input);
    } catch (_) {
      try {
        ArrayBufferPrototypeGetByteLength(input as ArrayBuffer);
        return new Uint8Array(input);
      } catch (_) {
        throw new TypeError(
          'The "input" argument must be of type BufferSource',
        );
      }
    }
  }
}
