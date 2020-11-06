const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { Plugin } = require('@vizality/entities');
const { Menu } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = class CopyRawMessage extends Plugin {
  onStart () {
    this.patchContextMenu();
  }

  onStop () {
    unpatch('copy-raw-message');
  }

  async patchContextMenu () {
    const MessageContextMenu = getModule(m => m.default && m.default.displayName === 'MessageContextMenu');

    patch('copy-raw-message', MessageContextMenu, 'default', ([ props ], res) => {
      const { message } = props;

      if (!message || !message.content) return res;

      res.props.children.push(
        <Menu.MenuItem
          label='Copy Raw Message'
          id='copy-raw-message'
          action={async () => DiscordNative.clipboard.copy(message.content)}
        />
      );

      return res;
    });
  }
};
