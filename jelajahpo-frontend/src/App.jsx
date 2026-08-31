import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Wisata from "./pages/Wisata";
import Kategori from "./pages/Kategori";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="wisata" element={<Wisata />} />
          <Route path="kategori" element={<Kategori />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}