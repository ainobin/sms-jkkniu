import Header from "./Heaader/Header";
import Footer from "./Footer/Footer";
import OrderForm from "./forms/orderForm";
import Navbar from "../components/Navbar/Navbar.jsx";
import Profile from "./Profile/Profile.jsx";
import Preview from "./Preview.jsx";
import generatePDF from "./utils/generatePDF.js";

import RegisterHome from "./register/RegisterHome.jsx";
import RegisterProcessOrder from "./register/RegisterProcessOrder.jsx";

import AdminHome from "./deptAdmin/AdminHome.jsx";

import ManagerHome from "./StoreManager/ManagerHome.jsx"
import ManagerProcessOrder from "./StoreManager/ManagerProcessOrder.jsx";
import AddNewItem from "./StoreManager/AddNewItem.jsx";
import Restock from "./StoreManager/Restock.jsx";
import StockCheck from "./StoreManager/StockCheck.jsx";
import Transactions from "./StoreManager/Transactions.jsx";




export{

    Header,
    Footer,
    OrderForm,
    Navbar,
    Profile,
    Preview,
    generatePDF,
    
    AddNewItem,
    Restock,
    StockCheck,
    ManagerProcessOrder,
    ManagerHome,
    Transactions,

    RegisterHome,
    RegisterProcessOrder,
    
    AdminHome,

    // receptMaker,
}