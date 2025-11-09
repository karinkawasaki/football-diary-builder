import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ メールリンク → このページに来た時、セッションを復元
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
      }
    );

    // cleanup
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("⚠️ " + error.message);
      return;
    }

    setMessage("✅ パスワードが更新されました！ログインしてください。");
    setTimeout(() => {
      window.location.href = "/login"; // 自動でログインページへ
    }, 1500);
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="diary-form"
      style={{ maxWidth: 400, margin: "60px auto" }}
    >
      <h2>🔄 新しいパスワード</h2>

      <input
        type="password"
        placeholder="新しいパスワード"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>更新</button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </form>
  );
}
