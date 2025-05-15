import { ExplorerDisplayMenuButton } from '@affine/core/components/explorer/display-menu';
import { ExplorerNavigation } from '@affine/core/components/explorer/header/navigation';
import { Header } from '@affine/core/components/pure/header';

export const TagDetailHeader = () => {
  return (
    <Header
      left={<ExplorerNavigation active={'tags'} />}
      right={<ExplorerDisplayMenuButton />}
    />
  );
};
