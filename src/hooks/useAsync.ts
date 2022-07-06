import { useCallback, useEffect, useRef, useState } from 'react';

export const useSafeSetState = () => {
	const isMounted = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	return useCallback((fn: AnyFunction) => {
		if (isMounted.current) {
			fn();
		}
	}, []);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAsyncFunction = (...args: any[]) => Promise<any>;

type UseAsyncParams<AsyncFN extends AnyAsyncFunction> = {
	fn: AsyncFN;
	runAtStart?: boolean;
};

type AnyFunction = () => void;

type UseAsyncReturnType<AsyncFN extends AnyAsyncFunction> = {
	loading: boolean;
	value: Awaited<ReturnType<AsyncFN>> | null;
	error: Error | null;
	callAgain: (...params: Parameters<AsyncFN>) => void;
};

export const useAsync = <AsyncFn extends AnyAsyncFunction>(
	args: UseAsyncParams<AsyncFn>,
	...params: Parameters<AsyncFn>
): UseAsyncReturnType<AsyncFn> => {
	const { fn, runAtStart = true } = args;

	const setStateSafe = useSafeSetState();
	const [loading, setLoading] = useState(runAtStart);
	const [value, setValue] = useState<Awaited<ReturnType<AsyncFn>> | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const runFn = useCallback(
		async (...newParams: Parameters<AsyncFn> | []) => {
			const paramsToSpread = newParams.length ? newParams : params;

			try {
				setStateSafe(() => {
					setLoading(true);
				});
				const result = await fn(...paramsToSpread);

				setStateSafe(() => {
					setValue(result);
				});
			} catch (error) {
				setStateSafe(() => {
					setError(error as Error);
				});
			} finally {
				setStateSafe(() => {
					setLoading(false);
				});
			}
		},
		[fn, params, setStateSafe]
	);

	const runFnRef = useRef(runFn);

	useEffect(() => {
		runFnRef.current = runFn;
	}, [runFn]);

	useEffect(() => {
		if (runAtStart) {
			runFnRef.current();
		}
	}, [runAtStart]);

	return {
		loading,
		value,
		error,
		callAgain: useCallback((...params: Parameters<AsyncFn>) => {
			runFnRef.current(...params);
		}, []),
	};
};
