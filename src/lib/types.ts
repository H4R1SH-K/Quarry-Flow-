export type Sale = {
    name: string;
    total: number;
};

export type RecentSale = {
    id: string;
    name: string;
    initials: string;
    email: string;
    amount: string;
};

export type CostRevenue = {
    month: string;
    revenue: number;
    dieselCost: number;
};
