const loaded: Record<string, boolean> = {};

export const loadScript = (url: string, id: string): Promise<void> => {
	if (loaded[id]) {
		return Promise.resolve();
	}

	if (loaded[id] !== undefined && loaded[id] === false) {
		const script = document.querySelector(`#${id}`) as HTMLScriptElement;

		return new Promise((resolve, reject) => {
			script.onload = () => {
				loaded[id] = true;
				resolve();
			};
			script.onerror = reject;
		});
	}

	return new Promise((resolve, reject) => {
		loaded[id] = false;
		const script = document.createElement('script');
		script.onload = () => {
			loaded[id] = true;
			resolve();
		};
		script.src = url;
		script.id = id;
		script.onerror = reject;

		document.head.appendChild(script);
	});
};
