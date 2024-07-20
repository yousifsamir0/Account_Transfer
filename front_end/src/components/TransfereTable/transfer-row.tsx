import React from 'react';
import { Account, Transfer } from '../../types';

interface TransferRowProps {
    transfer: Transfer;
    self: Account
}

const TransferRow: React.FC<TransferRowProps> = ({ transfer, self }) => {

    return (
        <tr className="bg-white border-b max-h-10 ">
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${self.name === transfer.from_account.name ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {transfer.from_account.name}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${self.name === transfer.to_account.name ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {transfer.to_account.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transfer.amount / 100}
            </td>
        </tr>
    );
};

export default TransferRow;
