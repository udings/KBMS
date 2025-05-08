import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import NewItem from "./pages/NewItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/items/:id" element={<ItemDetail />} />
      <Route path="/items/new" element={<NewItem />} />
    </Routes>
  );
}

export default App;
