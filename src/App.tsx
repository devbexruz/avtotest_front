import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"
import Layout from "./components/Layout/Layout"
import server from "./utils/Backend";

function App() {
  // Language get in localStorage

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes auth={server.checkAuth()}/>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
