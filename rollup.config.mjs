import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
	{
		input: "build/index.js",
		output: {
			file: "./dist/library.js",
			format: "es",
			inlineDynamicImports: true
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			commonjs({})
		]
	},
	{
		input: "build/example.js",
		output: {
			file: "./dist/example.js",
			format: "es",
			inlineDynamicImports: true
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			commonjs({})
		]
	}
];
