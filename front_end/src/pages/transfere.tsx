// import React, { useState, useEffect, useCallback } from 'react';
// import Select, { SingleValue } from 'react-select';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import axios from 'axios';
// import { useDebouncedCallback } from 'use-debounce';
// import { Account, PaginatedData, Transfer } from '../types'

// type Option = {
//     value: string;
//     label: string;
// }

// const TransferFunds: React.FC = () => {

//     const accountsUrl = new URL('http://127.0.0.1:8000/api/accounts/')
//     const createTransferUrl = new URL('http://127.0.0.1:8000/api/accounts/transfer/')
//     const { register, handleSubmit, setValue, formState: { errors } } = useForm<Transfer>();
//     const [accounts, setAccounts] = useState<Option[]>([]);
//     const [loading, setLoading] = useState(false);

//     const fetchAccounts = async (inputValue: string) => {
//         setLoading(true);
//         try {
//             const response = await axios.get<PaginatedData<Account>>(accountsUrl.href, {
//                 params: { search: inputValue, limit: 10 }
//             });
//             const accountOptions = response.data.results.map(account => ({ value: account.id, label: account.name }));
//             setAccounts(accountOptions);
//             console.log(accountOptions)
//         } catch (error) {
//             console.error('There was an error fetching the accounts!', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const debouncedFetchAccounts = useDebouncedCallback((inputValue: string) => {
//         fetchAccounts(inputValue);
//     }, 300);

//     const handleInputChange = (inputValue: string) => {
//         if (inputValue) {
//             debouncedFetchAccounts(inputValue);
//         }
//     };

//     const onSubmit: SubmitHandler<Transfer> = data => {
//         axios.post(createTransferUrl.href, {
//             from_account: data.from_account.id,
//             to_account: data.to_account.id,
//             amount: data.amount
//         })
//             .then(_response => {
//                 alert('Transfer successful!');
//             })
//             .catch(error => {
//                 alert('Transfer failed: ' + error.message);
//             });
//     };

//     return (
//         <div className="max-w-md mx-auto mt-10">
//             <h2 className="text-2xl font-bold mb-6">Transfer Funds</h2>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Sender Account</label>
//                     <Select
//                         options={accounts}
//                         isLoading={loading}
//                         onInputChange={handleInputChange}
//                         onChange={(option: SingleValue<Option>) => option && setValue('from_account.id', option?.value)}
//                     />
//                     {errors.from_account && <p className="text-red-500 text-sm">This field is required</p>}
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Receiver Account</label>
//                     <Select
//                         options={accounts}
//                         isLoading={loading}
//                         onInputChange={handleInputChange}
//                         onChange={(option: SingleValue<Option>) => setValue('to_account.id', option?.value as string)}
//                     />
//                     {errors.to_account && <p className="text-red-500 text-sm">This field is required</p>}
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Amount</label>
//                     <input
//                         type="number"
//                         {...register('amount', { required: true })}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                     />
//                     {errors.amount && <p className="text-red-500 text-sm">This field is required</p>}
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                     Transfer
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default TransferFunds;
import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { Account, PaginatedData, Transfer } from '../types';

type Option = {
    value: string;
    label: string;
};

const TransferFunds: React.FC = () => {
    const accountsUrl = new URL('http://127.0.0.1:8000/api/accounts/');
    const createTransferUrl = new URL('http://127.0.0.1:8000/api/accounts/transfer/');
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<Transfer>();
    const [senderAccounts, setSenderAccounts] = useState<Option[]>([]);
    const [receiverAccounts, setReceiverAccounts] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSender, setSelectedSender] = useState<Account | null>(null);

    const fetchAccounts = async (inputValue: string, setAccounts: React.Dispatch<React.SetStateAction<Option[]>>) => {
        setLoading(true);
        try {
            const response = await axios.get<PaginatedData<Account>>(accountsUrl.href, {
                params: { search: inputValue, limit: 10 }
            });
            const accountOptions = response.data.results.map(account => ({ value: account.id, label: account.name }));
            setAccounts(accountOptions);
        } catch (error) {
            console.error('There was an error fetching the accounts!', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchSenderAccounts = useDebouncedCallback((inputValue: string) => {
        fetchAccounts(inputValue, setSenderAccounts);
    }, 300);

    const debouncedFetchReceiverAccounts = useDebouncedCallback((inputValue: string) => {
        fetchAccounts(inputValue, setReceiverAccounts);
    }, 300);

    const handleSenderInputChange = (inputValue: string) => {
        if (inputValue) {
            debouncedFetchSenderAccounts(inputValue);
        }
    };

    const handleReceiverInputChange = (inputValue: string) => {
        if (inputValue) {
            debouncedFetchReceiverAccounts(inputValue);
        }
    };

    const onSubmit: SubmitHandler<Transfer> = data => {
        if (selectedSender && selectedSender.balance < Math.floor(data.amount * 100)) {
            alert('Insufficient balance for the transfer.');
            return;
        }

        axios.post(createTransferUrl.href, {
            from_account: data.from_account.id,
            to_account: data.to_account.id,
            amount: Math.floor(data.amount * 100)
        })
            .then(_response => {
                alert('Transfer successful!');
            })
            .catch(error => {
                alert('Transfer failed: ' + error.message);
            });
    };

    useEffect(() => {
        const fromAccountId = watch('from_account.id');
        if (fromAccountId) {
            axios.get<Account>(`${accountsUrl.href}${fromAccountId}/`)
                .then(response => {
                    setSelectedSender(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the account details!', error);
                });
        }
    }, [watch('from_account.id')]);

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Transfer Funds</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700">Sender Account</label>
                    <Select
                        options={senderAccounts}
                        isLoading={loading}
                        onInputChange={handleSenderInputChange}
                        onChange={(option: SingleValue<Option>) => {
                            setValue('from_account.id', option?.value || '');
                        }}
                    />
                    {errors.from_account && <p className="text-red-500 text-sm">This field is required</p>}
                </div>
                {selectedSender && (
                    <div className="mb-4">
                        <p className="text-gray-700">Balance: ${selectedSender.balance / 100}</p>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700">Receiver Account</label>
                    <Select
                        options={receiverAccounts}
                        isLoading={loading}
                        onInputChange={handleReceiverInputChange}
                        onChange={(option: SingleValue<Option>) => {
                            setValue('to_account.id', option?.value || '');
                        }}
                    />
                    {errors.to_account && <p className="text-red-500 text-sm">This field is required</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Amount</label>
                    <input
                        type="text"
                        {...register('amount', { required: true })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    {errors.amount && <p className="text-red-500 text-sm">This field is required</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-secondary py-2 px-4 rounded-md hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Transfer
                </button>
            </form>
        </div>
    );
};

export default TransferFunds;
