import { Routes, Route } from "react-router-dom"
import { HomeSite } from "@/pages/Home"
import ResultViewer from "@/pages/ResultViewer"

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomeSite />} />
            <Route path="/result" element={<ResultViewer />} />
        </Routes>
    )
}