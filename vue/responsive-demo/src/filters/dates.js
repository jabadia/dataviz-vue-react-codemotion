import dayjs from 'dayjs';

export function formatDate(d) {
    return dayjs(d).format('MM-YYYY');
}

export const MONTH_NAMES = [
    'Ene', 'Feb', 'Mar',
    'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep',
    'Oct', 'Nov', 'Dic',
];

export function monthName(m) {
    return MONTH_NAMES[m];
}
