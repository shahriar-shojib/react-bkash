import { createBkashButton } from './initBkash';
import { loadScript } from './loadScript';

export const loadDeps = async (bkashScriptURL: string) => {
	if (!document.querySelector('#jquery')) {
		await loadScript('https://code.jquery.com/jquery-3.3.1.min.js', 'jquery');
	}
	createBkashButton();

	if (!document.querySelector('#jquery')) {
		await loadScript(bkashScriptURL, 'bkashScript');
	}
};
