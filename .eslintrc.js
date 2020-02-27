module.exports =  {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  'rules': {
    'linebreak-style': ['error', 'unix']
  }
};
