import { Button, usePromptModal } from '@affine/component';
import {
  createDocExplorerContext,
  DocExplorerContext,
} from '@affine/core/components/explorer/context';
import { DocsExplorer } from '@affine/core/components/explorer/docs-view/docs-list';
import { Filters } from '@affine/core/components/filter';
import {
  CollectionService,
  PinnedCollectionService,
} from '@affine/core/modules/collection';
import { CollectionRulesService } from '@affine/core/modules/collection-rules';
import type { FilterParams } from '@affine/core/modules/collection-rules/types';
import { FeatureFlagService } from '@affine/core/modules/feature-flag';
import { useI18n } from '@affine/i18n';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback, useEffect, useState } from 'react';

import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewTitle,
} from '../../../../modules/workbench';
import { AllPage as AllPageOld } from '../all-page-old/all-page';
import { AllDocSidebarTabs } from '../layouts/all-doc-sidebar-tabs';
import * as styles from './all-page.css';
import { AllDocsHeader } from './all-page-header';
import { MigrationAllDocsDataNotification } from './migration-data';
import { PinnedCollections } from './pinned-collections';

export const AllPage = () => {
  const t = useI18n();

  const collectionService = useService(CollectionService);
  const pinnedCollectionService = useService(PinnedCollectionService);

  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const selectedCollection = useLiveData(
    selectedCollectionId
      ? collectionService.collection$(selectedCollectionId)
      : null
  );

  useEffect(() => {
    // if selected collection is not found, set selected collection id to null
    if (!selectedCollection && selectedCollectionId) {
      setSelectedCollectionId(null);
    }
  }, [selectedCollection, selectedCollectionId]);

  const selectedCollectionInfo = useLiveData(
    selectedCollection ? selectedCollection.info$ : null
  );

  const [tempFilters, setTempFilters] = useState<FilterParams[]>([]);

  const [explorerContextValue] = useState(createDocExplorerContext);

  const groupBy = useLiveData(explorerContextValue.groupBy$);
  const orderBy = useLiveData(explorerContextValue.orderBy$);

  const { openPromptModal } = usePromptModal();

  const collectionRulesService = useService(CollectionRulesService);
  useEffect(() => {
    const subscription = collectionRulesService
      .watch(
        // collection filters and temp filters can't exist at the same time
        selectedCollectionInfo
          ? {
              filters: selectedCollectionInfo.rules.filters,
              groupBy,
              orderBy,
              extraAllowList: selectedCollectionInfo.allowList,
              extraFilters: [
                {
                  type: 'system',
                  key: 'empty-journal',
                  method: 'is',
                  value: 'false',
                },
                {
                  type: 'system',
                  key: 'trash',
                  method: 'is',
                  value: 'false',
                },
              ],
            }
          : {
              filters:
                tempFilters && tempFilters.length > 0
                  ? tempFilters
                  : [
                      // if no filters are present, match all non-trash documents
                      {
                        type: 'system',
                        key: 'trash',
                        method: 'is',
                        value: 'false',
                      },
                    ],
              groupBy,
              orderBy,
              extraFilters: [
                {
                  type: 'system',
                  key: 'empty-journal',
                  method: 'is',
                  value: 'false',
                },
                {
                  type: 'system',
                  key: 'trash',
                  method: 'is',
                  value: 'false',
                },
              ],
            }
      )
      .subscribe({
        next: result => {
          explorerContextValue.groups$.next(result.groups);
        },
        error: error => {
          console.error(error);
        },
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [
    collectionRulesService,
    explorerContextValue,
    groupBy,
    orderBy,
    selectedCollection,
    selectedCollectionInfo,
    tempFilters,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        explorerContextValue.selectMode$.next(false);
        explorerContextValue.selectedDocIds$.next([]);
        explorerContextValue.prevCheckAnchorId$.next(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [explorerContextValue]);

  const handleFilterChange = useCallback((filters: FilterParams[]) => {
    setTempFilters(filters);
  }, []);

  const handleSaveFilters = useCallback(() => {
    openPromptModal({
      title: t['com.affine.editCollection.saveCollection'](),
      label: t['com.affine.editCollectionName.name'](),
      inputOptions: {
        placeholder: t['com.affine.editCollectionName.name.placeholder'](),
      },
      children: t['com.affine.editCollectionName.createTips'](),
      confirmText: t['com.affine.editCollection.save'](),
      cancelText: t['com.affine.editCollection.button.cancel'](),
      confirmButtonOptions: {
        variant: 'primary',
      },
      onConfirm(name) {
        const id = collectionService.createCollection({
          name,
          rules: {
            filters: tempFilters,
          },
        });
        pinnedCollectionService.addPinnedCollection({
          collectionId: id,
          index: pinnedCollectionService.indexAt('after'),
        });
        setTempFilters([]);
        setSelectedCollectionId(id);
      },
    });
  }, [
    collectionService,
    openPromptModal,
    pinnedCollectionService,
    t,
    tempFilters,
  ]);

  return (
    <DocExplorerContext.Provider value={explorerContextValue}>
      <ViewTitle title={t['All pages']()} />
      <ViewIcon icon="allDocs" />
      <ViewHeader>
        <AllDocsHeader />
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <MigrationAllDocsDataNotification />
          <div className={styles.pinnedCollection}>
            <PinnedCollections
              activeCollectionId={selectedCollectionId}
              onClickAll={() => setSelectedCollectionId(null)}
              onClickCollection={collectionId => {
                setSelectedCollectionId(collectionId);
                setTempFilters([]);
              }}
              onAddFilter={params => {
                setSelectedCollectionId(null);
                setTempFilters([...(tempFilters ?? []), params]);
              }}
              hiddenAdd={tempFilters.length > 0}
            />
          </div>
          {tempFilters.length > 0 && (
            <div className={styles.filterArea}>
              <Filters
                className={styles.filters}
                filters={tempFilters ?? []}
                onChange={handleFilterChange}
              />
              <Button
                variant="plain"
                onClick={() => {
                  setTempFilters([]);
                }}
              >
                {t['Cancel']()}
              </Button>
              <Button onClick={handleSaveFilters}>{t['save']()}</Button>
            </div>
          )}
          <div className={styles.scrollArea}>
            <DocsExplorer />
          </div>
        </div>
      </ViewBody>
      <AllDocSidebarTabs />
    </DocExplorerContext.Provider>
  );
};

export const Component = () => {
  const featureFlagService = useService(FeatureFlagService);
  const enableNewAllDocsPage = useLiveData(
    featureFlagService.flags.enable_new_all_docs_page.$
  );

  return enableNewAllDocsPage ? <AllPage /> : <AllPageOld />;
};
