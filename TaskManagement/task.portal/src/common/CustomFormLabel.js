import React from 'react';
import {Popover} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

const CustomFormLabel = ({ labelkey, popoverkey }) => {
  return (
    <span>
      <FormattedMessage id={labelkey} />{' '}
      <Popover content={<FormattedMessage id={popoverkey} />}>
        <InfoCircleOutlined />
      </Popover>
    </span>
  );
};

export default CustomFormLabel;
