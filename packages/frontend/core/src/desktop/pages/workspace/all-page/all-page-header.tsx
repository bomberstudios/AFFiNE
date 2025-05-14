import { type MenuProps } from '@affine/component';
import { ExplorerDisplayMenuButton } from '@affine/core/components/explorer/display-menu';
import { ViewToggle } from '@affine/core/components/explorer/display-menu/view-toggle';
import { ExplorerNavigation } from '@affine/core/components/explorer/header/navigation';

import * as styles from './all-page-header.css';

const menuProps: Partial<MenuProps> = {
  contentOptions: {
    side: 'bottom',
    align: 'end',
    alignOffset: 0,
    sideOffset: 8,
  },
};
export const AllDocsHeader = () => {
  return (
    <div className={styles.header}>
      <ExplorerNavigation active="docs" />

      <div className={styles.actions}>
        <ViewToggle />
        <ExplorerDisplayMenuButton menuProps={menuProps} />
      </div>
    </div>
  );
};
