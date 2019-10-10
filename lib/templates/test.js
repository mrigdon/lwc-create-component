'use babel';

import upperFirst from 'lodash/upperFirst';
import kebabCase from 'lodash/kebabCase';

export default (moduleName, componentName) =>
`import ${upperFirst(componentName)} from '../${componentName}';
import appendElement from 'lib/testUtils/appendElement';
import cleanDocument from 'lib/testUtils/cleanDocument';

describe('${moduleName}-${kebabCase(componentName)}', () => {
  afterEach(cleanDocument);

  it('', () => {
    const el = appendElement('${moduleName}-${kebabCase(componentName)}', ${upperFirst(componentName)});
  });
});
`;
