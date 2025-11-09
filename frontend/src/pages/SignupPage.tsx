import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("⚠️ パスワードが一致しません");
      return;
    }

    // Supabase 新規登録
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // ✅ 既に存在するアカウント判定
    if (data?.user && data.user.identities?.length === 0) {
      setMessage(
        "⚠️ このメールアドレスはすでに登録されています。\n" +
        "ログインするか、メール認証がまだの場合はメールを確認してください。"
      );
      return;
    }

    // ✅ その他のエラー
    if (error) {
      setMessage("⚠️ " + error.message);
      return;
    }

    const user = data?.user;
    if (!user) return;

    // ✅ MySQL へ保存
    await fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, email: user.email }),
    });

    setMessage(
      "✅ アカウント仮登録が完了しました！\n" +
      "登録メールを送信しました！\n" +
      "リンクをクリックして認証を完了してください。"
    );
  };
  
  return (
    <div className="page-container">
      <h2 style={{ color: "#9C2F3F", marginBottom: 16 }}>Sign Up / 新規登録</h2>

      <form
        onSubmit={handleSignup}
        style={{
          background: "white",
          padding: 24,
          borderRadius: 14,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <input
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 18, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 18, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <button type="submit" style={{ width: "100%" }}>Sign Up</button>

        {message && (
          <p style={{ whiteSpace: "pre-line", marginTop: 16, color: "#9C2F3F", fontWeight: 600 }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}