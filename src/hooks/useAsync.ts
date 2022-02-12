/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';

export const useIsMounted = (): React.MutableRefObject<boolean> => {
	const isMounted = useRef(true);

	useEffect(
		() => () => {
			isMounted.current = false;
		},
		[]
	);

	return isMounted;
};

type AnyPromiseFunction = (...args: any[]) => Promise<any>;

type Awaited<T extends AnyPromiseFunction> = T extends () => Promise<infer U> ? U : never;

type UseAsyncReturnType<T extends AnyPromiseFunction> = {
	loading: boolean;
	error: Error | null;
	data: Awaited<T> | null;
	call: (...args: Parameters<T>) => void;
};

export const useAsync = <T extends AnyPromiseFunction>(
	cb: T,
	deps: DependencyList = [],
	delayCall = false
): UseAsyncReturnType<T> => {
	const [data, setData] = useState<Awaited<T> | null>(null);
	const [loading, setLoading] = useState<true | false>(false);
	const [error, setError] = useState<Error | null>(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const callBack = useCallback((args: any[]) => cb(args), [...deps, cb]);
	const isMountedRef = useIsMounted();

	const fetchData = useCallback(
		async (...args: any[]) => {
			setLoading(true);
			try {
				const result = await callBack(args);
				if (!isMountedRef.current) return;

				setData(result);
			} catch (error) {
				if (!isMountedRef.current) return;

				if (error instanceof Error) {
					setError(error);
					return;
				}

				setError(new Error((error as Error)?.message || 'Unknown error'));
			} finally {
				if (isMountedRef.current) {
					setLoading(false);
				}
			}
		},
		[callBack, isMountedRef]
	);

	const fetchDataRef = useRef(fetchData);

	useEffect(() => {
		fetchDataRef.current = fetchData;
	}, [fetchData]);

	useEffect(() => {
		if (!delayCall) {
			fetchDataRef.current();
		}
	}, [delayCall]);

	return { loading, data, error, call: fetchData };
};
