import typescript from 'rollup-plugin-typescript2';
import * as terser from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
	input: 'src/index.tsx',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
			strict: false,
		},
	],
	plugins: [typescript({ check: false }), terser.terser({ ecma: 5, compress: true })],
	external: ['react', 'react-dom'],
};
