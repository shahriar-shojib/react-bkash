/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

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
export const useAsync = <T extends AnyPromiseFunction>(cb: T, delayCall = false): UseAsyncReturnType<T> => {
	const [data, setData] = useState<Awaited<T> | null>(null);
	const [loading, setLoading] = useState<true | false>(false);
	const [error, setError] = useState<Error | null>(null);

	const cbRef = useRef(cb);
	cbRef.current = cb;

	const isMounted = useIsMounted();

	const fetchData = useCallback(
		async (...args: any[]) => {
			setLoading(true);
			try {
				const result = await cbRef.current(args);
				if (!isMounted.current) return;

				setData(result);
			} catch (error) {
				if (!isMounted.current) return;

				if (error instanceof Error) {
					setError(error);
					return;
				}

				setError(new Error((error as Error)?.message || 'Unknown error'));
			} finally {
				if (isMounted.current) {
					setLoading(false);
				}
			}
		},
		[isMounted]
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
