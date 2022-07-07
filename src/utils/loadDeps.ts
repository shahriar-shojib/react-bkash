import { loadScript } from './loadScript';

export const loadDependencies = async (bkashScriptURL: string): Promise<void> => {
	await loadScript('https://code.jquery.com/jquery-3.3.1.min.js', 'jquery');
	await loadScript(bkashScriptURL, 'bkashScript');
};
