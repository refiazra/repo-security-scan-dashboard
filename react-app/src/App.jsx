import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Repositories from "./pages/Repositories.jsx";
import NewScan from "./pages/NewScan.jsx";
import ScanDetail from "./pages/ScanDetail.jsx";
import Findings from "./pages/Findings.jsx";
import FindingDetail from "./pages/FindingDetail.jsx";
import ScanHistory from "./pages/ScanHistory.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Repositories />} />
          <Route path="/new-scan" element={<NewScan />} />
          <Route path="/repos/:repoId" element={<ScanDetail />} />
          <Route path="/scans/:scanId/findings" element={<Findings />} />
          <Route path="/findings/:findingId" element={<FindingDetail />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
