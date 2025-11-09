import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email,{
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) return setMessage("⚠️ " + error.message);
    setMessage("📩 パスワード再設定用のメールを送信しました！");
  };

  return (
    <form onSubmit={handleReset} className="diary-form" style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>🔑 パスワードをリセット</h2>
      <input type="email" placeholder="メールアドレス" onChange={(e) => setEmail(e.target.value)} />
      <button>パスワード再設定メールを送る</button>
      <p>{message}</p>
    </form>
  );
}
