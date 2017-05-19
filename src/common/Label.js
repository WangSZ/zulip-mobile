import React from 'react';
import { Text } from 'react-native';
import { FormattedMessage } from 'react-intl';

import styles from '../styles';

export default ({ text, style, ...restProps }) => (
  <Text style={[styles.label, style]} {...restProps}>
    <FormattedMessage id={text} defaultMessage={text} />
  </Text>
);