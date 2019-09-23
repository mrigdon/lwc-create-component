'use babel';

import LwcCreateComponentView from './lwc-create-component-view';
import { CompositeDisposable } from 'atom';

export default {
  lwcCreateComponentView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.lwcCreateComponentView = new LwcCreateComponentView(
      state.lwcCreateComponentViewState,
      this.deactivate.bind(this)
    );
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.lwcCreateComponentView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'lwc-create-component:toggle': () => this.toggle()
      })
    );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.lwcCreateComponentView.destroy();
  },

  serialize() {
    return {
      lwcCreateComponentViewState: this.lwcCreateComponentView.serialize()
    };
  },

  toggle() {
    console.log('LwcCreateComponent was toggled!');
    return this.modalPanel.isVisible()
      ? this.modalPanel.hide()
      : this.modalPanel.show();
  }
};
