module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
    ],
    settings: {
        react: { version: 'detect' },
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        // React 18: no default export — stop failing the build for that pattern
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        // pragmatic relaxations (raise to warn, not error)
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-console': 'warn',
        '@typescript-eslint/no-empty-object-type': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-unresolved': 'error',
        'react-hooks/purity': 'error',
        'react-hooks/set-state-in-effect': 'error',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'import/order': ['warn', { 'newlines-between': 'always' }],
        'react/no-unknown-property': ['error', { ignore: ['geometry', 'args', 'position', 'intensity', 'attach', 'color', 'emissive', 'emissiveIntensity', 'roughness', 'metalness', 'transparent', 'opacity', 'blending', 'rotation', 'scale', 'castShadow', 'receiveShadow', 'onPointerOver', 'onPointerOut', 'onClick', 'fov', 'gl', 'antialias', 'alpha', 'onUpdate'] }],
        'react/prop-types': 'off',
    },
};
