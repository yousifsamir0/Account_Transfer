import React from 'react';
import { Account } from '../../types';
import { Link } from 'react-router-dom';

interface AccountRowProps {
    account: Account;
    onDelete?: (id: string) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({ account, onDelete }) => {
    const relativePath = `${account.id}`
    return (
        <tr className="bg-white border-b">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link to={relativePath}>{account.name}</Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.balance / 100}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onClick={() => onDelete && onDelete(account.id)} className="text-red-500 hover:text-red-700 ml-2">Delete</button>
            </td>
        </tr>
    );
};

export default AccountRow;
