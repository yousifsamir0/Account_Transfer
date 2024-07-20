

export type Account = {
    id: string;
    name: string;
    balance: number;
}
export type Transfer = {
    from_account: Account;
    to_account: Account;
    amount: number;
}


export type PaginatedData<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[]
}