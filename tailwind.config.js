module.exports = (isProd) => ({
    prefix: '',
    purge: {
      enabled: isProd,
      content: [
        '**/*.{html,ts}',
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        width: {
          xxs: '15rem'
        }
      },
    },
    variants: {
      extend: {
        opacity: ['disabled'],
        borderRadius: ['first', 'last']
      },
    },
    plugins: [],
});
