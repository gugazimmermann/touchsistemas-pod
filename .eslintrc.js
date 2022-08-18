module.exports = {
	env: {
		browser: true,
		es2021: true,
		'jest/globals': true,
	},
	extends: ['plugin:react/recommended', 'plugin:jest/recommended', 'airbnb', 'prettier'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'jest'],
	rules: {
		'jsx-a11y/label-has-associated-control': [
			'error',
			{
				required: {
					some: ['nesting', 'id'],
				},
			},
		],
		'jsx-a11y/label-has-for': [
			'error',
			{
				required: {
					some: ['nesting', 'id'],
				},
			},
		],
		'no-underscore-dangle': 0,
		'import/extensions': [
			'error',
			'always',
			{
				js: 'never',
				jsx: 'never',
			},
		],
		'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'import/no-extraneous-dependencies': 'off',
		'react/jsx-no-bind': 'off',
		'react/jsx-no-constructed-context-values': 'off',
		'no-param-reassign': 'off',
		'jsx-a11y/control-has-associated-label': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'no-nested-ternary': 'off',
		'no-await-in-loop': 'off'
	},
};
