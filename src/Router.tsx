import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { History } from "./pages/history/History";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/history" element={<History />}></Route>
    </Routes>
  );
}
