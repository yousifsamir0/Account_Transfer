import { Account, Transfer, } from '../../types';
import { usePageniation } from '../../hooks/use-pagination-query';
import Pagination from '../pagination';
import { useState } from 'react';
import TransferRow from './transfer-row';


const TransferTable = ({ account }: { account: Account }) => {
    const [url, _setUrl] = useState(new URL(`http://127.0.0.1:8000/api/accounts/${account.id}/transfer`))

    const {
        data,
        currentPage,
        isLoading,
        totalPages,
        fetchPage,
        fetchNextPage,
        fetchPreviousPage,
        error,
    } = usePageniation<Transfer>({
        queryKey: [`transfer-${account.id}`],
        apiUrl: url,
        pageSize: 4
    })


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className="h-full flex w-10/12 flex-col items-center space-y-4">

            <div className="mt-3 self-end mr-3">
                <Pagination
                    currentPage={currentPage + 1}
                    fetchPage={fetchPage}
                    nextPage={fetchNextPage}
                    previousPage={fetchPreviousPage}
                    totalPages={totalPages}
                />
            </div>
            <table className="min-w-full bg-white ">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 bg-primary border-secondary text-left leading-4 text-secondary tracking-wider">From</th>
                        <th className="px-6 py-3 border-b-2 bg-primary border-secondary text-left leading-4 text-secondary tracking-wider">To</th>
                        <th className="px-6 py-3 border-b-2 bg-primary border-secondary text-left leading-4 text-secondary tracking-wider">Amount</th>
                        <th className="px-6 py-3 border-b-2 bg-primary border-secondary text-left leading-4 text-secondary tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className='max-h-10'>
                    {data && data.results.map((transfer: Transfer, i) => (
                        <TransferRow key={i} transfer={transfer} self={account} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransferTable;
