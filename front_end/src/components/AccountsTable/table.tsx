import AccountRow from './account-row';
import { Account, } from '../../types';
import { usePageniation } from '../../hooks/use-pagination-query';
import Pagination from '../pagination';
import Inputsearch from '../input-search';
import { useState } from 'react';




const AccountTable = () => {
    const deleteUrl = 'http://127.0.0.1:8000/api/accounts/'
    const [url, setUrl] = useState(new URL("http://127.0.0.1:8000/api/accounts/"))

    const {
        data,
        currentPage,
        isLoading,
        totalPages,
        fetchPage,
        refetch,
        fetchNextPage,
        fetchPreviousPage,
        error,
    } = usePageniation<Account>({
        queryKey: ['accounts'],
        apiUrl: url,
        pageSize: 8
    })
    const hadleOnChange = async (value: string) => {

        const newUrl = new URL(url.href);
        const params = newUrl.searchParams
        if (value.trim() === "" && !params.has('search')) {
            return
        }
        if (value.trim() === "" && params.has('search')) {
            params.delete('search')
        }
        else {
            newUrl.searchParams.set('search', value)
        }
        setUrl(newUrl)
    }



    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${url.origin + url.pathname + id}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                refetch()
            } else {
                console.error('Failed to delete account');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className="flex flex-col items-center justify-center w-4/5 min-w-[700px]  ">
            <div className=' w-full h-16 flex justify-between items-center'>
                <Inputsearch onChangeSearch={hadleOnChange} />
                <Pagination
                    currentPage={currentPage + 1}
                    fetchPage={fetchPage}
                    nextPage={fetchNextPage}
                    previousPage={fetchPreviousPage}
                    totalPages={totalPages}
                />

            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-secondary text-left leading-4 bg-primary text-secondary tracking-wider">Name</th>
                        <th className="px-6 py-3 border-b-2 border-secondary text-left leading-4 bg-primary text-secondary tracking-wider">Balance</th>
                        <th className="px-6 py-3 border-b-2 border-secondary text-left leading-4 bg-primary text-secondary tracking-wider">Controls</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.results.map((account) => (
                        <AccountRow key={account.id} account={account} onDelete={handleDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountTable;
