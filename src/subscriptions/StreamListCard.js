/* @flow */
import { connect } from 'react-redux';

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Auth, Dispatch, GlobalState } from '../types';
import { ZulipButton } from '../common';
import { subscriptionAdd, subscriptionRemove } from '../api';
import { streamNarrow } from '../utils/narrow';
import StreamList from '../streams/StreamList';
import { getAuth, getCanCreateStreams, getStreams, getSubscriptions } from '../selectors';
import { doNarrow, navigateToCreateStream } from '../actions';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    margin: 16,
  },
});

type Props = {
  dispatch: Dispatch,
  auth: Auth,
  canCreateStreams: boolean,
  streams: [],
  subscriptions: [],
};

type State = {
  filter: string,
};

class StreamListCard extends PureComponent<Props, State> {
  props: Props;

  state: State;

  state = {
    filter: '',
  };

  handleFilterChange = (filter: string) => this.setState({ filter });

  handleSwitchChange = (streamName: string, switchValue: boolean) => {
    const { auth } = this.props;

    if (switchValue) {
      subscriptionAdd(auth, [{ name: streamName }]);
    } else {
      subscriptionRemove(auth, [streamName]);
    }
  };

  clearInput = () => {
    this.setState({ filter: '' });
  };

  handleNarrow = (streamName: string) => {
    const { dispatch } = this.props;
    dispatch(doNarrow(streamNarrow(streamName)));
  };

  render() {
    const { dispatch, canCreateStreams, streams, subscriptions } = this.props;
    const filteredStreams = streams.filter(x => x.name.includes(this.state.filter));
    const subsAndStreams = filteredStreams.map(x => ({
      ...x,
      subscribed: subscriptions.some(s => s.stream_id === x.stream_id),
    }));

    return (
      <View style={styles.wrapper}>
        {canCreateStreams && (
          <ZulipButton
            style={styles.button}
            secondary
            text="Create new stream"
            onPress={() => {
              dispatch(navigateToCreateStream);
            }}
          />
        )}
        <StreamList
          streams={subsAndStreams}
          showSwitch
          showDescriptions
          onSwitch={this.handleSwitchChange}
          onPress={this.handleNarrow}
          clearInput={this.clearInput}
        />
      </View>
    );
  }
}

export default connect((state: GlobalState) => ({
  auth: getAuth(state),
  canCreateStreams: getCanCreateStreams(state),
  streams: getStreams(state),
  subscriptions: getSubscriptions(state),
}))(StreamListCard);
