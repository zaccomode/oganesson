import type { StorybookConfig } from '@storybook/sveltekit';
import type { Plugin, PluginOption } from 'vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs'
	],
	framework: '@storybook/sveltekit',
	core: { disableTelemetry: true },

	// @storybook/sveltekit 10.6 strips SvelteKit 2's dev-server plugins by name, but
	// SvelteKit 3 moved its SSR middleware into `vite-plugin-sveltekit-setup`. Left in,
	// it server-renders any unknown request (e.g. /favicon.ico) and crashes on
	// Storybook's browser-only $app mocks. Storybook never needs Kit's SSR, so drop
	// just that hook. Remove once @storybook/sveltekit supports SvelteKit 3.
	viteFinal(config) {
		const plugins = (config.plugins ?? []).flat(Infinity as 1) as PluginOption[];
		for (const plugin of plugins) {
			if (plugin && (plugin as Plugin).name === 'vite-plugin-sveltekit-setup') {
				delete (plugin as Plugin).configureServer;
			}
		}
		return config;
	}
};

export default config;
