import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    // ✅ 保存（今のまま + username 追加）
    localStorage.setItem("user_id", data.user?.id || "");

    // ✅ username をメールの @ より前から生成
    const username = email.split("@")[0];
    localStorage.setItem("username", username);

    setMessage("✅ Login successful!");
    window.location.href = "/";
  };

  return (
    <div className="page-container">
      <h2 style={{ color: "#9C2F3F", marginBottom: 16 }}>Log In / ログイン</h2>

      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 24,
          borderRadius: 14,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
        }}
      >
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 18, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <Link to="/reset" style={{ fontSize: 14, marginTop: 8 }}>パスワードをお忘れですか？</Link>


        <button type="submit" style={{ width: "100%" }}>Log In</button>

        {message && <p style={{ marginTop: 14, color: "#9C2F3F" }}>{message}</p>}
      </form>
    </div>
  );
}