'use babel';

const fs = require('fs');
import htmlTemplate from './templates/html';
import jsTemplate from './templates/javascript';
import cssTemplate from './templates/css';
import testTemplate from './templates/test';

const requiredFiles = {
  js: jsTemplate,
  html: htmlTemplate
};

export default class LwcCreateComponentView {
  constructor(serializedState) {
    // Create root element
    this.element = this.createElement();
    this.element.classList.add('lwc-create-component');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.render();
    element.querySelector('form').onsubmit = e => {
      const componentPath = e.target.elements.name.value;
      const includeTest = e.target.elements.test.checked;
      const includeCss = e.target.elements.css.checked;

      const [moduleName, componentName] = componentPath.split('/');
      this.createBundle(moduleName, componentName, includeTest, includeCss);
    };
    return element;
  }

  createBundle(moduleName, componentName, includeTest, includeCss) {
    const projectPath = atom.project.getPaths()[0];
    const modulePath = `${projectPath}/src/modules/${moduleName}`;
    const componentPath = `${modulePath}/${componentName}`;

    if (!fs.existsSync(modulePath)) fs.mkdirSync(modulePath);
    if (!fs.existsSync(componentPath)) fs.mkdirSync(componentPath);

    Object.keys(requiredFiles).forEach(extension => {
      const body = requiredFiles[extension](moduleName, componentName);
      fs.writeFileSync(`${componentPath}/${componentName}.${extension}`, body);
    });

    if (includeCss) {
      fs.writeFileSync(`${componentPath}/${componentName}.css`, cssTemplate());
    }

    if (includeTest) {
      const testPath = `${componentPath}/__tests__`;
      if (!fs.existsSync(testPath)) fs.mkdirSync(testPath);
      fs.writeFileSync(
        `${testPath}/${componentName}.test.js`,
        testTemplate(moduleName, componentName)
      );
    }
  }

  getElement() {
    return this.element;
  }

  render() {
    return `
      <form>
        <div>
          <label for="name">Component Name</label>
        </div>
        <div>
          <input id="name" class="native-key-bindings" />
        </div>

        <div>
          <input id="test" class="native-key-bindings" type="checkbox" checked />
          <label for="test">Include test?</label>
        </div>

        <div>
          <input id="css" class="native-key-bindings" type="checkbox" />
          <label for="css">Include CSS?</label>
        </div>

        <div>
          <button type="submit">Create Component</button>
        </div>
      </form>
    `;
  }
}
