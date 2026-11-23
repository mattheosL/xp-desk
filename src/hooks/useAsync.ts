import { useCallback, useState } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  run: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Hook to manage async operations with loading/error/success states.
 *
 * Usage:
 *   const { run, isLoading, isError, error, isSuccess } = useAsync(myAsyncFn);
 *   await run(arg1, arg2);
 */
export function useAsync<T>(
  asyncFn: (...args: never[]) => Promise<T>,
): AsyncState<T> {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: unknown[]): Promise<T | undefined> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await (asyncFn as (...a: unknown[]) => Promise<T>)(...args);
        setData(result);
        setStatus('success');
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
        setError(message);
        setStatus('error');
        return undefined;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return {
    status,
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    run,
    reset,
  };
}
