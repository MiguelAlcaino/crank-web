/**
 * T: The type of data in case of success (e.g., Shopping Cart)
 * E: The type of error code in case of failure (e.g., ShoppingCartBusinessError)
 */
export type ServiceResult<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E; message?: string }
