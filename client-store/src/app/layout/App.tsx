import { useEffect, useState } from "react";
import Header from "./Header";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactTostify.css";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/Util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

// const products = [
//   { name: "product1", price: 100.0 },
//   { name: "product2", price: 300.0 },
// ];

function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]);

  const [mode, setMode] = useState(false);

  function toggleMode() {
    setMode((mode) => !mode);
  }

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#3c8ee0",
        light: "#5f98e9",
        dark: "#004ba0",
      },
      secondary: {
        main: "#27c783",
        light: "#4dce94",
        dark: "#009356",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: "#000000",
        secondary: "#555555",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#111314",
        light: "#e3f2fd",
        dark: "#1976d2",
      },
      secondary: {
        main: "#80e6b8",
        light: "#b2f2db",
        dark: "#27c783",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#bbbbbb",
      },
    },
  });

  if (loading) return <LoadingComponent message="Initializing app..." />;

  return (
    <ThemeProvider theme={mode === false ? lightTheme : darkTheme}>
      <ToastContainer position="top-center" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header mode={mode} toggleMode={toggleMode} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
