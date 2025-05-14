import { RadioGroup, type RadioItem } from '@affine/component';
import { useLiveData } from '@toeverything/infra';
import { useCallback, useContext } from 'react';

import { DocExplorerContext } from '../context';
import {
  type DocListItemView,
  DocListViewIcon,
} from '../docs-view/doc-list-item';
import * as styles from './view-toggle.css';

const views = [
  {
    label: <DocListViewIcon view="masonry" />,
    value: 'masonry',
    className: styles.viewToggleItem,
  },
  {
    label: <DocListViewIcon view="grid" />,
    value: 'grid',
    className: styles.viewToggleItem,
  },
  {
    label: <DocListViewIcon view="list" />,
    value: 'list',
    className: styles.viewToggleItem,
  },
] satisfies RadioItem[];

export const ViewToggle = () => {
  const explorerContextValue = useContext(DocExplorerContext);

  const view = useLiveData(explorerContextValue.view$);

  const handleViewChange = useCallback(
    (view: DocListItemView) => {
      explorerContextValue.view$?.next(view);
    },
    [explorerContextValue.view$]
  );

  return (
    <RadioGroup
      itemHeight={24}
      gap={8}
      padding={0}
      items={views}
      value={view}
      onChange={handleViewChange}
      className={styles.viewToggle}
      borderRadius={4}
      indicatorClassName={styles.viewToggleIndicator}
    />
  );
};
