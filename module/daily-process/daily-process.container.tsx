import React, { FC } from 'react';

import {
  useMoneyFlowQuery,
  MoneyFlow,
  useCountProgramStatusQuery,
} from 'generated/graphql';
import DailyProcess from './daily-process';
import useTodaysProcessingActivities from './hooks/use-todays-processing-activities.hook';

export const DailyProcessContainer: FC = () => {
  const { data: moneyFlowData, loading: moneyFlowLoading } = useMoneyFlowQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      take: 2,
    },
  });

  const {
    processingActivitiesLoading,
    pagination,
    currentProcessingActivityType,
    onChangeProcessingActivityType,
    currentProcessingActivityData,
  } = useTodaysProcessingActivities();

  const {
    data: programStatusFilesPendingCount,
    loading: programStatusFilesPendingCountLoading,
  } = useCountProgramStatusQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      where: {
        active: { equals: true },
        filesStatus: { equals: 'Pending' },
      },
    },
  });

  return (
    <div>
      <DailyProcess
        processingActivityData={currentProcessingActivityData}
        processingActivityLoading={processingActivitiesLoading}
        pagination={pagination}
        moneyFlowData={
          (moneyFlowData && (moneyFlowData.moneyFlows as MoneyFlow[])) || []
        }
        moneyFlowLoading={moneyFlowLoading}
        programStatusFilesPendingCount={
          programStatusFilesPendingCount?.countProgramStatus
        }
        programStatusFilesPendingLoading={programStatusFilesPendingCountLoading}
        valueProcessingActivityType={currentProcessingActivityType}
        onChangeProcessingActivityType={onChangeProcessingActivityType}
      />
    </div>
  );
};

export default DailyProcessContainer;