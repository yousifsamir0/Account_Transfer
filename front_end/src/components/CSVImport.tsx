import React, { useRef } from 'react';
import { PiFileCsv } from 'react-icons/pi';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';




const CustomFileInputButton: React.FC = () => {
    const importCsvUrl = new URL('http://127.0.0.1:8000/api/accounts/import/')
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const refetchAccounts = () => {
        queryClient.refetchQueries({ queryKey: ['accounts'] })
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post(importCsvUrl.href, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
                refetchAccounts()
            } catch (error) {
                console.error('There was an error uploading the file!', error);
            }

        }
    };

    return (
        <div className="flex flex-col self-start  items-start justify-start min-w-52 w-52">
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={handleButtonClick}
                className=" flex justify-around items-center w-52 bg-green-500 text-primary px-4 py-2 rounded hover:bg-green-600"
            >
                <PiFileCsv size={32} className='text-white bg-black' />
                Import Accounts
            </button>
        </div>
    );
};

export default CustomFileInputButton;
