import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Account } from '../types';
import TransferTable from '../components/TransfereTable/table';



export const AccountDetails = ({ }) => {
    const { id } = useParams();
    const {
        data: account,
        isError,
        isLoading,
    } = useQuery({
        queryKey: [id],
        queryFn: async () => {
            const res = await fetch("http://127.0.0.1:8000/api/accounts/" + id)
            const jsonRes: Account = await res.json()
            return jsonRes
        }
    })
    return (
        <div className=" space-y-6 w-8/12 flex-1 shadow-2xl flex flex-col items-center pt-8 pb-3">
            <div className=' bg-secondary flex justify-center space-x-32 text-primary text-3xl rounded-2xl card w-5/6 h-40 '>
                <div className=' flex-col  flex justify-evenly items-center p-6 rounded-2xl'>
                    <h1>Account Name </h1>
                    <h1>{account?.name}</h1>
                </div>
                <div className=' flex-col  flex justify-evenly items-center p-6 rounded-2xl'>
                    <h1>Account Balance </h1>
                    <h1>${account?.balance && (account?.balance / 100)}</h1>
                </div>
            </div>
            <div className='flex items-center justify-center text-primary text-3xl bg-secondary h-20 w-full'>
                <h1>Transfer History</h1>
            </div>
            {account && <TransferTable account={account} />}

        </div>
    )
}
