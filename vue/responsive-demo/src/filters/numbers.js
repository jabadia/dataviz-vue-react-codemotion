const ONE_MILLION = 1000000;

export function formatMoney(n) {
    n = Number(n);

    if (n > ONE_MILLION) {
        return `${(n / ONE_MILLION).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    }

    if (n > 10000) {
        return `${(n / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
    }

    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercent(n) {
    return `${Number(n * 100).toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatNumber(n) {
    return `${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
