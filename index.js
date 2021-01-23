import React from 'react';

import { ContextMenu } from '@vizality/components';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Plugin } from '@vizality/entities';

export default class CopyRawMessage extends Plugin {
  start () {
    this.patchContextMenu();
  }

  stop () {
    unpatch('copy-raw-message');
  }

  async patchContextMenu () {
    const MessageContextMenu = getModule(m => m.default?.displayName === 'MessageContextMenu');

    patch('copy-raw-message', MessageContextMenu, 'default', ([ props ], res) => {
      const { message } = props;

      if (!message || !message.content) return res;

      res.props.children.push(
        <ContextMenu.Item
          label='Copy Raw Message'
          id='copy-raw-message'
          action={() => DiscordNative.clipboard.copy(message.content)}
        />
      );

      return res;
    });
  }
}
