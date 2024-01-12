import { ActivityLog } from 'generated/graphql';
import { formatCurrency } from 'shared/utils/helper';
import { IActivityLogTableData } from './activity-log.interface';

const labelToFieldNameMap = new Map<string, string[]>([
  ['Platform Deposits', ['platformBal', 'platformAccts']],
  ['less: Excess FDIC Balances', ['excessFDIC', 'excessFDICBankAccts']],
  ['Net Bank Deposits', ['netBankDep', 'netBankAccts']],
]);

type ActivityLogParam = Omit<ActivityLog, 'programId' | '__typename'> & {
  id: string;
};

export const parseActivityLogData = (
  data: ActivityLogParam
): IActivityLogTableData[] => {
  const labels = Array.from(labelToFieldNameMap.keys());
  return labels.map((value, index) => {
    const itemKeys = labelToFieldNameMap.get(value) as Array<
      keyof ActivityLogParam
    >;
    const amount = data[itemKeys[0]];
    const accounts = data[itemKeys[1]];

    return {
      id: index,
      settle: value,
      amount: amount ? formatCurrency({ value: parseFloat(amount) }) : '-',
      accounts: accounts
        ? formatCurrency({
            value: parseFloat(accounts),
            hideSymbol: true,
            minimumDecimalDigits: 0,
            maximumDecimalDigits: 0,
          })
        : '-',
    };
  });
};
