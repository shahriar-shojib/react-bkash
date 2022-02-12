export type Maybe<T> = { data: T; error: null } | { data: null; error: Error };

export async function post<T>(
	url: string,
	body: Record<string, string>,
	additionalHeaders: Record<string, string> = {}
): Promise<Maybe<T>> {
	try {
		const data = await fetch(url, {
			headers: {
				'content-type': 'application/json',
				...additionalHeaders,
			},
			method: 'POST',
			body: JSON.stringify(body),
		}).then((r) => r.json());
		return { data: data as T, error: null };
	} catch (error) {
		return { data: null, error };
	}
}
