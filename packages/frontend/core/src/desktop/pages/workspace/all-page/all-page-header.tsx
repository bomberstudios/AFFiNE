import { type MenuProps, RadioGroup, type RadioItem } from '@affine/component';
import { ExplorerDisplayMenuButton } from '@affine/core/components/explorer/display-menu';
import {
  type DocListItemView,
  DocListViewIcon,
} from '@affine/core/components/explorer/docs-view/doc-list-item';
import { ExplorerNavigation } from '@affine/core/components/explorer/header/navigation';
import type { ExplorerDisplayPreference } from '@affine/core/components/explorer/types';
import { useCallback } from 'react';

import * as styles from './all-page-header.css';

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

const ViewToggle = ({
  view,
  onViewChange,
}: {
  view: DocListItemView;
  onViewChange: (view: DocListItemView) => void;
}) => {
  return (
    <RadioGroup
      itemHeight={24}
      gap={8}
      padding={0}
      items={views}
      value={view}
      onChange={onViewChange}
      className={styles.viewToggle}
      borderRadius={4}
      indicatorClassName={styles.viewToggleIndicator}
    />
  );
};

const menuProps: Partial<MenuProps> = {
  contentOptions: {
    side: 'bottom',
    align: 'end',
    alignOffset: 0,
    sideOffset: 8,
  },
};
export const AllDocsHeader = ({
  displayPreference,
  onDisplayPreferenceChange,
}: {
  displayPreference: ExplorerDisplayPreference;
  onDisplayPreferenceChange: (
    displayPreference: ExplorerDisplayPreference
  ) => void;
}) => {
  const handleViewChange = useCallback(
    (view: DocListItemView) => {
      onDisplayPreferenceChange({ ...displayPreference, view });
    },
    [displayPreference, onDisplayPreferenceChange]
  );

  return (
    <div className={styles.header}>
      <ExplorerNavigation active="docs" />

      <div className={styles.actions}>
        <ViewToggle
          view={displayPreference.view ?? 'list'}
          onViewChange={handleViewChange}
        />
        <ExplorerDisplayMenuButton
          menuProps={menuProps}
          displayPreference={displayPreference}
          onDisplayPreferenceChange={onDisplayPreferenceChange}
        />
      </div>
    </div>
  );
};
