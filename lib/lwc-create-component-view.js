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
  constructor(serializedState, deactivate) {
    // Create root element
    this.element = this.createElement();
    this.deactivate = deactivate;
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

      if (!moduleName || !componentName) return;

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

    this.resetForm();

    this.deactivate();
  }

  getElement() {
    return this.element;
  }

  resetForm() {
    this.element.querySelector('#name').value = '';
    this.element.querySelector('#test').checked = true;
    this.element.querySelector('#css').checked = false;
  }

  render() {
    return `
      <form class="lcc-form">
        <h1>Create LWC Component</h1>

        <div class="lcc-form__field">
          <div>
            <label for="name">
              Component Name
              <span class="lcc-form__asterisk">*</span>
            </label>
          </div>
          <div>
            <input
              id="name"
              class="native-key-bindings lcc-form__input"
              placeholder="i.e. my/coolThing"
              required
            />
          </div>
        </div>

        <div class="lcc-form__field">
          <input id="test" class="native-key-bindings" type="checkbox" checked />
          <label for="test">Include test?</label>
        </div>

        <div class="lcc-form__field">
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
