declare const _brand: unique symbol;
export type Brand<T, B> = T & { [_brand]: B };
export type AccountId = Brand<string, "AccountId">;
export const AccountId = (id: string): AccountId => id as AccountId;
