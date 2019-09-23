'use babel';

import upperFirst from 'lodash/upperFirst';
import kebabCase from 'lodash/kebabCase';

export default (moduleName, componentName) =>
`import { createElement } from 'lwc';
import ${upperFirst(componentName)} from '${moduleName}/${componentName}';

describe('${moduleName}-${kebabCase(componentName)}', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('', () => {

  });
});
`;
