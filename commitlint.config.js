const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-nx-scopes', '@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'scope-enum': async (ctx) => [
      2,
      'always',
      [
        ...(await getProjects(ctx)),
        'release', // for versioning
      ],
    ],
  },
};
