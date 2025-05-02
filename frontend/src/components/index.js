import Header from "./Heaader/Header";
import Footer from "./Footer/Footer";
import OrderForm from "./forms/orderForm";
import Navbar from "../components/Navbar/Navbar.jsx";
import Profile from "./Profile/Profile.jsx";
import Preview from "./Preview.jsx";
import generateOrderReciptPDF from "./utils/generateOrderReciptPDF.js";
import generateTransactionPDF from "./utils/generateTransactionPDF.js";

import RegisterHome from "./register/RegisterHome.jsx";
import RegisterProcessOrder from "./register/RegisterProcessOrder.jsx";

import AdminHome from "./deptAdmin/AdminHome.jsx";

import ManagerHome from "./StoreManager/ManagerHome.jsx"
import ManagerProcessOrder from "./StoreManager/ManagerProcessOrder.jsx";
import AddNewItem from "./StoreManager/AddNewItem.jsx";
import Restock from "./StoreManager/Restock.jsx";

import StockCheck from "./StockTransactions/StockCheck.jsx";
import Transactions from "./StockTransactions/Transactions.jsx"
import Allocation from "./StockTransactions/Allocation.jsx";
import FullAudit from "./StockTransactions/FullAudit.jsx";


export{

    Header,
    Footer,
    OrderForm,
    Navbar,
    Profile,
    Preview,
    generateOrderReciptPDF,
    generateTransactionPDF,
    
    AddNewItem,
    Restock,
    ManagerProcessOrder,
    ManagerHome,
    
    StockCheck,
    Transactions,
    Allocation,
    FullAudit,

    RegisterHome,
    RegisterProcessOrder,
    
    AdminHome,

    // receptMaker,
}