import { FC, useEffect, useMemo } from 'react';

import {
  useActivityLogLazyQuery,
  useBankActivityLogLazyQuery,
} from 'generated/graphql';
import CustomTable from 'shared/components/custom-table/custom-table';
import { activityLogColumns } from './utils/activity-log-table-columns';
import { parseActivityLogData } from './utils/activity-log.helper';
import { ProcessingActivitiesTypes } from 'modules/daily-process/hooks/use-todays-processing-activities.hook';

interface IActivityLogProps {
  id: string;
  name: string;
  currentProcessingActivityType: ProcessingActivitiesTypes;
}

export const ActivityLog: FC<IActivityLogProps> = ({
  id,
  name,
  currentProcessingActivityType,
}) => {
  const [
    getActivityLog,
    { data: activityLogData, loading: activityLogLoading },
  ] = useActivityLogLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [
    getBankActivityLog,
    { data: bankActivityLogData, loading: bankActivityLogLoading },
  ] = useBankActivityLogLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (
      currentProcessingActivityType === ProcessingActivitiesTypes.ProgramView
    ) {
      getActivityLog({
        variables: {
          where: { programId: id },
        },
      });
    }

    if (
      currentProcessingActivityType ===
      ProcessingActivitiesTypes.SettlementBankView
    ) {
      getBankActivityLog({
        variables: {
          where: { borId: id },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProcessingActivityType, id]);

  const rows = useMemo(() => {
    if (
      currentProcessingActivityType === ProcessingActivitiesTypes.ProgramView &&
      activityLogData?.activityLog
    ) {
      return parseActivityLogData(activityLogData.activityLog);
    }

    if (
      currentProcessingActivityType ===
        ProcessingActivitiesTypes.SettlementBankView &&
      bankActivityLogData?.bankActivityLog
    ) {
      return parseActivityLogData(bankActivityLogData.bankActivityLog);
    }

    return [];
  }, [activityLogData, bankActivityLogData, currentProcessingActivityType]);

  return (
    <div>
      <CustomTable
        containerTitle={`Activity Log for: ${name}`}
        columns={activityLogColumns()}
        rows={rows}
        loading={!rows.length && (activityLogLoading || bankActivityLogLoading)}
        hideFooter
      />
    </div>
  );
};
