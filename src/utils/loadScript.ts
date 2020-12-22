export const loadScript = (url: string, id: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.onload = resolve.bind(id);
		script.src = url;
		script.id = id;
		script.onerror = reject;
		document.head.appendChild(script);
	});
};
