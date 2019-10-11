'use babel';

import upperFirst from 'lodash/upperFirst';
import kebabCase from 'lodash/kebabCase';

export default (moduleName, componentName) =>
`import Basic from './basic/basic';
import example from 'lib/storybook/example';

export default {
  title: '${upperFirst(componentName)}'
};

export const basic = () => example(module, Basic);
`;
