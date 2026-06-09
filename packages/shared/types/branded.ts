declare const _brand: unique symbol;
export type Brand<T, B> = T & { [_brand]: B };
