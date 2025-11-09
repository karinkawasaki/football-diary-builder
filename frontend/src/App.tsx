import { Routes, Route } from "react-router-dom";

import CalendarPage from "./pages/CalendarPage";
import NewDiaryPage from "./pages/NewDiaryPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import DiaryListPage from "./pages/DiaryListPage";
import DiaryPage from "./pages/DiaryPage";
import EditDiaryPage from "./pages/EditDiaryPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

export default function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<CalendarPage />} />
      <Route path="/new" element={<NewDiaryPage />} />
      <Route path="/list" element={<DiaryListPage />} />
      <Route path="/diary/:id" element={<DiaryPage />} />
      <Route path="/diary/edit/:id" element={<EditDiaryPage />} />
      <Route path="/reset" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
    </Routes>
    </>
  );
}
