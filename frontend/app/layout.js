"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/config/redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
        {children}
        </Provider>
        </body>
    </html>
  );
}const initialState = {
    projects: [],
    currentProject: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoggedIn: false,
    message: '',
};

