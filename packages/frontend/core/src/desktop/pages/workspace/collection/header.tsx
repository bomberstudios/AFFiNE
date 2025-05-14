import { FlexWrapper } from '@affine/component';
import { ExplorerDisplayMenuButton } from '@affine/core/components/explorer/display-menu';
import { ViewToggle } from '@affine/core/components/explorer/display-menu/view-toggle';
import { ExplorerNavigation } from '@affine/core/components/explorer/header/navigation';
import { Header } from '@affine/core/components/pure/header';

export const CollectionDetailHeader = () => {
  return (
    <Header
      right={
        <FlexWrapper gap={16}>
          <ViewToggle />
          <ExplorerDisplayMenuButton />
        </FlexWrapper>
      }
      left={<ExplorerNavigation active="collections" />}
    />
  );
};
