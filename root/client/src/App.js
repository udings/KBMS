import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import NewItem from "./pages/NewItem";
import Login from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized"; //

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/items/:id" element={<ItemDetail />} />
      <Route path="/items/new" element={<NewItem />} />
      <Route path="/login" element={<Login />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
}

export default App;
