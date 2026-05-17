import { Outlet } from "react-router-dom"
import Navbaar from "../Components/Navbaar"

function Layout() {
    return (
        <>
            <Navbaar />
            <Outlet />
        </>
    )
}

export default Layout
