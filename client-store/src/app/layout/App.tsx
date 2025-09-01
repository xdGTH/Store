import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactTostify.css";
// import { useStoreContext } from "../context/StoreContext";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

// const products = [
//   { name: "product1", price: 100.0 },
//   { name: "product2", price: 300.0 },
// ];

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

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

  return (
    <ThemeProvider theme={mode === false ? lightTheme : darkTheme}>
      <ToastContainer position="top-center" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header mode={mode} toggleMode={toggleMode} />
      {loading ? (
        <LoadingComponent message="Initializing app..." />
      ) : location.pathname === "/" ? (
        <HomePage />
      ) : (
        <Container sx={{ mt: 4 }}>
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;
