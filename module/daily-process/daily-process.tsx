import { CountProgramStatusQuery, MoneyFlow } from 'generated/graphql';
import { FC, useContext, useMemo } from 'react';

import { CustomTable } from 'shared/components/custom-table/custom-table';
import { IUsePagination } from 'shared/hooks/use-pagination/use-pagination';
import { dailyProcessColumns } from './utils/daily-process-table-columns';
import { useStyles } from './daily-proccess.style';
import { CircularProgress, Grid, useTheme } from '@material-ui/core';
import { SectionHeader } from 'shared/components/section-header/section-header';
import { dateFormat } from 'shared/utils/dates-helper';
import Divider from 'shared/components/custom-divider/custom-divider';
import { ModalContext } from 'shared/context/modal/modal.context';
import { moneyFlowColumns } from './utils/money-flow-table-columns';
import {
  parseMoneyFlowData,
  parseTodaysPositionsData,
} from './utils/daily-process.helper';
import { ActivityLog } from './components/activity-log/activity-log';
import CustomToggle from 'shared/components/custom-toggle/custom-toggle';
import {
  ProcessingActivitiesTypes,
  ProcessingActivityData,
} from './hooks/use-todays-processing-activities.hook';
import { LOADING_SIZE } from 'shared/constants/daily-process.constants';
import useGetLoadingType from './hooks/use-get-loading-type.hook';
import { oceanBlue, stoneBlue, velocityGreen } from 'shared/theme/variants';
import DoughnutChart from 'shared/components/doughnut-chart/doughnut-chart';

interface IDailyProcessProps {
  processingActivityData: ProcessingActivityData;
  processingActivityLoading: boolean;
  pagination: IUsePagination;
  moneyFlowData: MoneyFlow[];
  moneyFlowLoading: boolean;
  programStatusFilesPendingCount?: CountProgramStatusQuery['countProgramStatus'];
  programStatusFilesPendingLoading: boolean;
  valueProcessingActivityType: ProcessingActivitiesTypes;
  onChangeProcessingActivityType: (newValue: ProcessingActivitiesTypes) => void;
}

export const DailyProcess: FC<IDailyProcessProps> = ({
  processingActivityData,
  processingActivityLoading,
  pagination,
  moneyFlowData,
  moneyFlowLoading,
  programStatusFilesPendingCount,
  programStatusFilesPendingLoading,
  onChangeProcessingActivityType,
  valueProcessingActivityType,
}) => {
  const theme = useTheme();
  const { root } = useStyles();
  const { openModal, closeModal } = useContext(ModalContext);
  const { setSortModel } = pagination;
  const { sortModel } = pagination.pagination;

  const toggleOptions = useMemo(() => {
    const entries = Object.entries(ProcessingActivitiesTypes);
    return entries.map((value) => ({ key: value[0], value: value[1] }));
  }, []);

  const moneyFlowLoadingType = useGetLoadingType({
    networkLoading: moneyFlowLoading || programStatusFilesPendingLoading,
    cacheCondition:
      !!moneyFlowData.length && programStatusFilesPendingCount !== undefined,
  });

  const processingActivityLoadingType = useGetLoadingType({
    networkLoading: processingActivityLoading,
    cacheCondition: !!processingActivityData.rows.length,
  });

  const onClickActivityLog = (id: string, name: string) => () => {
    openModal({
      modalBody: (
        <ActivityLog
          id={id}
          name={name}
          currentProcessingActivityType={valueProcessingActivityType}
        />
      ),
      footer: {
        showFooter: true,
        onClickCancel: closeModal,
        cancelText: 'Close',
        config: {
          hideOk: true,
        },
      },
    });
  };

  const { excessFdicBal, netBankDep } = {
    ...parseTodaysPositionsData(moneyFlowData),
  };

  const chartData = {
    labels: ['Excess FDIC Balances', 'Net Bank Deposits'],
    datasets: [
      {
        data: [excessFdicBal, netBankDep],
        backgroundColor: [
          oceanBlue[500],
          stoneBlue[500],
          velocityGreen[500],
          theme.palette.grey[300],
        ],
        borderWidth: 6,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const chartLegendOptions: Chart.ChartLegendOptions = {
    display: true,
    position: 'bottom',
  };

  const dailyProcessTableColumns = useMemo(
    () => dailyProcessColumns(onClickActivityLog),
    // eslint-disable-next-line
    [valueProcessingActivityType]
  );

  return (
    <div className={root}>
      <SectionHeader
        title={`Daily Process - ${dateFormat(new Date(), 'EEE MMM d yyyy')}`}
      />
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid item xs={12} lg={9}>
          <CustomTable
            containerTitle="Money Flow Recon"
            elementNextToTitle={
              moneyFlowLoadingType === 'withCacheLoading' && (
                <CircularProgress size={LOADING_SIZE} />
              )
            }
            columns={moneyFlowColumns(moneyFlowData)}
            rows={parseMoneyFlowData(
              moneyFlowData,
              programStatusFilesPendingCount
            )}
            loading={moneyFlowLoadingType === 'noCacheLoading'}
            containerClassName="money-flow-table-container"
            hideFooter={true}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <DoughnutChart
            data={chartData}
            title={"Today's Positions"}
            legendOptions={chartLegendOptions}
            loadingNetwork={moneyFlowLoadingType === 'noCacheLoading'}
            loadingWithCache={moneyFlowLoadingType === 'withCacheLoading'}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTable
            containerTitle="Today's Processing Activities"
            elementNextToTitle={
              processingActivityLoadingType === 'withCacheLoading' && (
                <CircularProgress size={LOADING_SIZE} />
              )
            }
            columns={dailyProcessTableColumns}
            rows={processingActivityData.rows}
            loading={processingActivityLoadingType === 'noCacheLoading'}
            rowCount={processingActivityData.count}
            pagination={pagination}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            rowsPerPageOptions={[]}
            className="today-processing-table"
            description={
              <CustomToggle<ProcessingActivitiesTypes>
                options={toggleOptions}
                onChange={(_, value) => onChangeProcessingActivityType(value)}
                value={valueProcessingActivityType}
              />
            }
            wrapTitles
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DailyProcess;
