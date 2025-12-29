module.exports = {
    ci: {
        collect: {
            staticDistDir: './dist',
            numberOfRuns: 3,
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                // Performance budgets (ADR-009)
                'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
                'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['warn', { maxNumericValue: 200 }],
                'speed-index': ['warn', { maxNumericValue: 3000 }],

                // Accessibility (must pass)
                'color-contrast': 'error',
                'document-title': 'error',
                'html-has-lang': 'error',
                'meta-viewport': 'error',

                // Best practices
                'uses-https': 'off', // Localhost doesn't use HTTPS
                'is-crawlable': 'off', // Not relevant for SPA

                // SEO basics
                'document-title': 'error',
                'meta-description': 'warn',
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
