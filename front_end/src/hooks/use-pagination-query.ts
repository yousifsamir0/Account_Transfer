import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PaginatedData } from "../types";

interface usePageniationProps {
        queryKey: string[];
        apiUrl: URL;
        pageSize: number;
}


export const usePageniation = <T>({
        queryKey,
        apiUrl,
        pageSize
}: usePageniationProps) => {

        const [currentPage, setCurrentPage] = useState(0);
        const [totalPages, setTotalPages] = useState(0);

        const fetchAccounts = async (page = 0) => {
                const url = new URL(apiUrl.href);
                url.searchParams.set('limit', String(pageSize))
                url.searchParams.set('offset', String(page * pageSize))

                const res = await fetch(url);
                const jsonRes: PaginatedData<T> = await res.json()
                setTotalPages(Math.ceil(jsonRes.count / pageSize))
                console.log(jsonRes, Math.ceil(jsonRes.count / pageSize))
                return jsonRes;
        }
        const { isPending,
                isError,
                error,
                isLoading,
                data,
                isFetching,
                isPlaceholderData,
                refetch,

        } = useQuery({
                queryKey: [...queryKey, currentPage],
                queryFn: () => fetchAccounts(currentPage),
                placeholderData: keepPreviousData,
        })
        const fetchPage = (pageNumber: number) => {
                if (pageNumber <= totalPages && pageNumber >= 1)
                        setCurrentPage(pageNumber - 1)
        }
        const fetchNextPage = () => {
                if (!isPlaceholderData && data?.next) {
                        setCurrentPage(currentPage + 1)
                }
        }
        const fetchPreviousPage = () => {
                if (data?.previous)
                        setCurrentPage(Math.max(currentPage - 1, 0))
        }

        useEffect(() => {
                setCurrentPage(0);
                setTotalPages(0);
                refetch();

        }, [apiUrl]);

        return {
                isPending,
                isError,
                data,
                currentPage,
                totalPages,
                fetchPage,
                fetchNextPage,
                fetchPreviousPage,
                refetch,
                error,
                isFetching,
                isLoading,
                isPlaceholderData,
        }

}



