'use babel';

import upperFirst from 'lodash/upperFirst';

export default (moduleName, componentName) =>
`import { LightningElement } from 'lwc';

export default class ${upperFirst(componentName)} extends LightningElement {}
`;
