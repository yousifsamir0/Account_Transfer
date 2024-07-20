import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-primary p-4 flex justify-between w-full h-20">
            <div className="text-white text-2xl font-bold h-10 ">
                <img
                    width={350}
                    height={350}
                    src="beige-logoo.png"
                    alt="docspert logo"
                />
            </div>
            <div className="text-primary nav-links flex  justify-center items-center space-x-7 w-1/2 ">
                <div className="py-2 px-3 bg-secondary h-12 flex justify-center items-center hover:scale-105 ">
                    <Link to='/accounts'>
                        Account List
                    </Link>
                </div>
                <div className="py-2 px-3 bg-secondary h-12 flex justify-center items-center hover:scale-105">
                    <Link to='/transfer'>
                        Transfer Funds
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
