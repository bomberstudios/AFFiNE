import { MenuItem } from '@affine/component';
import type { GroupByParams } from '@affine/core/modules/collection-rules/types';
import { WorkspacePropertyService } from '@affine/core/modules/workspace-property';
import { useI18n } from '@affine/i18n';
import { DoneIcon } from '@blocksuite/icons/rc';
import { useLiveData, useService } from '@toeverything/infra';
import { cssVarV2 } from '@toeverything/theme/v2';
import { useMemo } from 'react';

import { WorkspacePropertyName } from '../../properties';
import {
  isSupportedSystemPropertyType,
  SystemPropertyTypes,
} from '../../system-property-types';
import {
  isSupportedWorkspacePropertyType,
  WorkspacePropertyTypes,
} from '../../workspace-property-types';
import { generateExplorerPropertyList } from '../properties';

const PropertyGroupByName = ({ groupBy }: { groupBy: GroupByParams }) => {
  const workspacePropertyService = useService(WorkspacePropertyService);
  const propertyInfo = useLiveData(
    workspacePropertyService.propertyInfo$(groupBy.key)
  );

  return propertyInfo ? (
    <WorkspacePropertyName propertyInfo={propertyInfo} />
  ) : null;
};

export const GroupByName = ({ groupBy }: { groupBy: GroupByParams }) => {
  const t = useI18n();
  if (groupBy.type === 'property') {
    return <PropertyGroupByName groupBy={groupBy} />;
  }
  if (groupBy.type === 'system') {
    const type = isSupportedSystemPropertyType(groupBy.key)
      ? SystemPropertyTypes[groupBy.key]
      : null;
    return type ? t.t(type.name) : null;
  }
  return null;
};

export const GroupByList = ({
  groupBy,
  onChange,
}: {
  groupBy?: GroupByParams;
  onChange?: (next: GroupByParams) => void;
}) => {
  const t = useI18n();
  const workspacePropertyService = useService(WorkspacePropertyService);
  const propertyList = useLiveData(workspacePropertyService.sortedProperties$);
  const explorerPropertyList = useMemo(() => {
    return generateExplorerPropertyList(propertyList);
  }, [propertyList]);

  return (
    <>
      {explorerPropertyList.map(({ systemProperty, workspaceProperty }) => {
        if (systemProperty) {
          const allowInGroupBy =
            'allowInGroupBy' in systemProperty && systemProperty.allowInGroupBy;
          if (!allowInGroupBy) {
            return null;
          }
          return (
            <MenuItem
              key={systemProperty.type}
              onClick={e => {
                e.preventDefault();
                onChange?.({
                  type: 'system',
                  key: systemProperty.type,
                });
              }}
              suffixIcon={
                groupBy?.type === 'system' &&
                groupBy?.key === systemProperty.type ? (
                  <DoneIcon style={{ color: cssVarV2('icon/activated') }} />
                ) : null
              }
            >
              {t.t(systemProperty.name)}
            </MenuItem>
          );
        } else if (workspaceProperty?.type) {
          const allowInGroupBy = isSupportedWorkspacePropertyType(
            workspaceProperty.type
          )
            ? WorkspacePropertyTypes[workspaceProperty.type].allowInGroupBy
            : false;
          if (!allowInGroupBy) {
            return null;
          }
          return (
            <MenuItem
              key={workspaceProperty.id}
              onClick={e => {
                e.preventDefault();
                onChange?.({
                  type: 'property',
                  key: workspaceProperty.id,
                });
              }}
              suffixIcon={
                groupBy?.type === 'property' &&
                groupBy?.key === workspaceProperty.id ? (
                  <DoneIcon style={{ color: cssVarV2('icon/activated') }} />
                ) : null
              }
            >
              <WorkspacePropertyName propertyInfo={workspaceProperty} />
            </MenuItem>
          );
        }
        return null;
      })}
    </>
  );
};
