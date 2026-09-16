import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { WalletProvider } from "./context/WalletContext";
import { ToastProvider } from "./context/ToastContext";
import { Home } from "./pages/Home";
import { CoinPage } from "./pages/CoinPage";
import { LaunchPage } from "./pages/LaunchPage";
import { ClaimPage } from "./pages/ClaimPage";
import { HowItWorks } from "./pages/HowItWorks";

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/coin/:id" element={<CoinPage />} />
              <Route path="/launch" element={<LaunchPage />} />
              <Route path="/claim" element={<ClaimPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </ToastProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}
