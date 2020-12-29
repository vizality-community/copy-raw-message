import React from 'react';

import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Menu } from '@vizality/components';
import { Plugin } from '@vizality/core';

export default class CopyRawMessage extends Plugin {
  onStart () {
    this.patchContextMenu();
  }

  onStop () {
    unpatch('copy-raw-message');
  }

  async patchContextMenu () {
    const MessageContextMenu = getModule(m => m.default?.displayName === 'MessageContextMenu');

    patch('copy-raw-message', MessageContextMenu, 'default', ([ props ], res) => {
      const { message } = props;

      if (!message || !message.content) return res;

      res.props.children.push(
        <Menu.MenuItem
          label='Copy Raw Message'
          id='copy-raw-message'
          action={() => DiscordNative.clipboard.copy(message.content)}
        />
      );

      return res;
    });
  }
}
