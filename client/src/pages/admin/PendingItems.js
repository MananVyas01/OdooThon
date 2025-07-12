import React from 'react';
import ManageItems from './ManageItems';

const PendingItems = () => {
  return <ManageItems pendingOnly={true} />;
};

export default PendingItems;
