import { makeStyles } from '@material-ui/styles';
import { muiGreen, muiGrey, white } from 'shared/theme/variants';

export const useStyles = makeStyles(() => ({
  root: {
    '& .today-processing-table': {
      '& .green-chip': {
        backgroundColor: muiGreen['500'],
        color: white,
      },
      '& .grey-chip': {
        backgroundColor: muiGrey['500'],
        color: white,
      },
    },
    '& .money-flow-table-container': {
      height: '100%',
      '& .MuiCard-root': {
        height: '100%',
      },
    },
    '& .view-activity-log-link': {
      whiteSpace: 'normal',
      lineHeight: 1,
    },
  },
}));