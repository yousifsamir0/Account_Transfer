import React from 'react';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    nextPage: () => void;
    previousPage: () => void;
    fetchPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, nextPage, previousPage, fetchPage }) => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage > totalPages - 3) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return (
        <div className=" flex items-center space-x-1 min-w-[500px]">
            <button
                onClick={() => (currentPage > 1) && previousPage()}
                className="px-3 py-1 bg-primary text-secondary rounded hover:border-black  disabled:opacity-50"
                disabled={currentPage === 1}
            >
                &larr; Prev
            </button>
            {pages.map((page, index) =>
                typeof page === 'string' ? (
                    <span key={index} className="px-3 py-1 text-black">
                        {page}
                    </span>
                ) : (
                    <button
                        key={index}
                        onClick={() => fetchPage(page)}
                        className={`px-3 py-1 ${currentPage === page ? 'bg-secondary text-primary rounded-full ' : 'bg-primary text-secondary'} rounded hover:bg-stone-700`}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={() => currentPage < totalPages && nextPage()}
                className="px-3 py-1 bg-primary text-secondary rounded hover:border-black hover:border-1 disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                Next &rarr;
            </button>
        </div>
    );
};

export default Pagination;
