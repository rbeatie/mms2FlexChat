import React from 'react';
import { FlexPlugin } from 'flex-plugin';
import reducers, { namespace } from './states';
import { VERSION } from '@twilio/flex-ui';
import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import MessageImageComponent from "./MessageImageComponent";
import ImageModal from "./ImageModal";
import SendMediaComponent from "./SendMediaComponent";

const PLUGIN_NAME = 'MmsPlugin';

export default class MmsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    const options = { sortOrder: -1 };
    flex.AgentDesktopView
      .Panel1
      .Content
      .add(<CustomTaskListContainer key="demo-component" />, options);

    flex.Actions.registerAction("smsModalControl", (payload, abort) => {
      var event = new Event("smsModalControlOpen");
      event.url = payload.url;
      document.dispatchEvent(event);
      return new Promise((resolve, reject) => {
        resolve();
      });
    });

    flex.MessageBubble.Content.add(<MessageImageComponent key="image" />);

    flex.MainContainer.Content.add(<ImageModal key="imageModal" />, {
      sortOrder: 1
    });

    flex.MessageInput.Content.add(<SendMediaComponent key="sendMedia" manager={manager}/>);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
