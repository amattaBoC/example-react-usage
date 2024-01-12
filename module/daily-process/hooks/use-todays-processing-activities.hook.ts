import {
    ProgramStatusFragment,
    useBankStatusPaginatedLazyQuery,
    useProgramStatusPaginatedLazyQuery,
  } from 'generated/graphql';
  import { useCallback, useEffect, useMemo, useState } from 'react';
  import { usePagination } from 'shared/hooks/use-pagination/use-pagination';
  
  export enum ProcessingActivitiesTypes {
    ProgramView = 'Program view',
    SettlementBankView = 'Settlement Bank View',
  }
  
  export type ProcessingActivityData = {
    rows: Omit<ProgramStatusFragment, '__typename'>[];
    count: number;
  };
  
  const useTodaysProcessingActivities = () => {
    const [currentProcessingActivityType, setCurrentProcessingActivityType] =
      useState(ProcessingActivitiesTypes.ProgramView);
  
    const pagination = usePagination({ take: 15 });
    const { skip, take, sortItem } = pagination.pagination;
  
    const [
      getProgramStatus,
      { data: programStatusData, loading: programStatusLoading },
    ] = useProgramStatusPaginatedLazyQuery({ fetchPolicy: 'cache-and-network' });
  
    const [getBankStatus, { data: bankStatusData, loading: bankStatusLoading }] =
      useBankStatusPaginatedLazyQuery({ fetchPolicy: 'cache-and-network' });
  
    const currentProcessingActivityData = useMemo<ProcessingActivityData>(() => {
      if (
        currentProcessingActivityType === ProcessingActivitiesTypes.ProgramView &&
        programStatusData?.programStatuses &&
        programStatusData?.aggregateProgramStatus._count?.programId
      ) {
        return {
          rows: programStatusData.programStatuses,
          count: programStatusData.aggregateProgramStatus._count.programId,
        };
      }
  
      if (
        currentProcessingActivityType ===
          ProcessingActivitiesTypes.SettlementBankView &&
        bankStatusData?.bankStatuses &&
        bankStatusData.aggregateBankStatus._count?.borId
      ) {
        return {
          rows: bankStatusData.bankStatuses,
          count: bankStatusData.aggregateBankStatus._count.borId,
        };
      }
  
      return {
        count: 0,
        rows: [],
      };
    }, [programStatusData, bankStatusData, currentProcessingActivityType]);
  
    const onChangeProcessingActivityType = useCallback(
      (newValue: ProcessingActivitiesTypes) =>
        setCurrentProcessingActivityType(newValue),
      []
    );
  
    useEffect(() => {
      const variables = {
        skip,
        take,
        where: { active: { equals: true } },
        orderBy:
          sortItem && sortItem.sort
            ? {
                [sortItem.field]: sortItem.sort,
              }
            : undefined,
      };
      if (
        currentProcessingActivityType === ProcessingActivitiesTypes.ProgramView
      ) {
        getProgramStatus({ variables });
        return;
      }
  
      if (
        currentProcessingActivityType ===
        ProcessingActivitiesTypes.SettlementBankView
      ) {
        getBankStatus({ variables });
      }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProcessingActivityType, skip, take, sortItem]);
  
    return {
      currentProcessingActivityType,
      onChangeProcessingActivityType,
      processingActivitiesLoading: programStatusLoading || bankStatusLoading,
      pagination,
      currentProcessingActivityData,
    } as const;
  };
  
  export default useTodaysProcessingActivities;
  