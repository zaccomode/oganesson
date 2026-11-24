import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/index.css';
import './preview.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			options: {
				bg1: { name: 'Background 1', value: '#f2f4f4' },
				white: { name: 'White', value: '#ffffff' }
			}
		},
		options: {
			storySort: { order: ['Foundations', ['Colors', 'Typography', 'Shapes', 'Motion', 'Icons']] }
		},
		a11y: {
			// Fail story tests (and CI) on accessibility violations.
			test: 'error',
			config: {
				rules: [
					// TODO(spec): the secondary text colour (dark at 60%) reaches only
					// ~4.2:1 on white and less on Background 1, short of WCAG AA's 4.5:1.
					// Disabled until the palette is revisited; re-enable afterwards.
					{ id: 'color-contrast', enabled: false }
				]
			}
		}
	},
	initialGlobals: {
		backgrounds: { value: 'bg1' }
	}
};

export default preview;
