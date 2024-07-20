
import AccountTable from '../components/AccountsTable/table'
import CustomFileInputButton from '../components/CSVImport'

export const Accounts = () => {
    return (

        <div className="mt-8 flex flex-col items-center w-8/12 shadow-2xl h-full pb-3">
            <CustomFileInputButton />
            <AccountTable />
        </div>

    )
}
