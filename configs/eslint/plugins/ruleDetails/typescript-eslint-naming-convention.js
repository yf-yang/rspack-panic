/**
 * Ignore certain suffixes for all configs.
 */
export function withSpecialSuffixes(...configs) {
  return [
    ...configs,
    ...configs.map(config => ({
      ...config,
      // If those suffixes exists, then those suffixes are removed, then check
      // the name
      filter: {
        match: true,
        regex: '(_INTERNAL|_EXPERIMENTAL|_DEPRECATED|_HOC)$',
      },
      suffix: ['_INTERNAL', '_EXPERIMENTAL', '_DEPRECATED', '_HOC'],
    })),
  ];
}

export default withSpecialSuffixes(
  {
    selector: 'default',
    format: ['strictCamelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'variable',
    modifiers: ['const'],
    format: ['strictCamelCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'enumMember',
    format: ['StrictPascalCase'],
  },
  {
    selector: 'objectLiteralProperty',
    format: ['strictCamelCase', 'PascalCase'], // Object literal as enum needs PascalCase members.
    leadingUnderscore: 'allow',
  },
  {
    selector: 'objectLiteralProperty',
    modifiers: ['requiresQuotes'],
    leadingUnderscore: 'allow',
    format: null, // not checked
  },
  {
    // For whatever reserved flag properties starting with `_$`
    selector: ['classProperty'],
    modifiers: ['public', 'readonly'],
    filter: {
      // NOTE: filter is performed before the leading underscore is trimmed, so
      // it is added
      regex: String.raw`^_\$whatever`,
      match: true,
    },
    format: null,
    leadingUnderscore: 'allow',
  },
  {
    selector: ['classProperty', 'parameterProperty'],
    modifiers: ['private'],
    format: ['strictCamelCase'],
    leadingUnderscore: 'require',
  },
  {
    selector: ['classProperty', 'parameterProperty'],
    modifiers: ['protected'],
    format: ['strictCamelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'classProperty',
    format: ['strictCamelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'classMethod',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'typeParameter',
    format: ['PascalCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'interface',
    format: ['PascalCase'],
    leadingUnderscore: 'allow',
    filter: {
      // HACK: https://github.com/typescript-eslint/typescript-eslint/issues/2359#issuecomment-669488854
      regex: '^I[A-Z]',
      match: true,
    },
    prefix: ['I'], // in case a Class and its Interface shares the same name, use I prefix
  },
  {
    selector: 'typeAlias',
    format: ['PascalCase'],
    leadingUnderscore: 'allow',
    filter: {
      // HACK: https://github.com/typescript-eslint/typescript-eslint/issues/2359#issuecomment-669488854
      regex: '^I[A-Z]',
      match: true,
    },
    prefix: ['I'],
  },
  {
    selector: 'typeLike',
    format: ['PascalCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'import',
    format: null,
  }
);
