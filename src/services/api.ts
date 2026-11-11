export interface ApiResponse<T> {
  data: T;
}

export async function get<T>(factory: () => T): Promise<ApiResponse<T>> {
  return Promise.resolve({ data: factory() });
}
