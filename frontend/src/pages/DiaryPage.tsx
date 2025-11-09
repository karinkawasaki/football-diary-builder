import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function DiaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/diaries/${id}`)
      .then((res) => res.json())
      .then(setDiary);
  }, [id]);

  if (!diary) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Poppins, sans-serif" }}>
      <Link to="/list" style={{ textDecoration: "none", color: "#9C2F3F" }}>← Back to Diary List</Link>

      <div style={{ textAlign: "right", marginTop: "-30px" }}>
        <button
          onClick={() => navigate(`/diary/edit/${id}`)}
          style={{
            background: "#9C2F3F",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            marginRight: "10px",
          }}
        >
          ✏️ Edit
        </button>

        <button
          onClick={async () => {
            if (window.confirm("本当に削除しますか？")) {
              await fetch(`http://localhost:3001/api/diaries/${id}`, { method: "DELETE" });
              navigate("/");
            }
          }}
          style={{
            background: "#555",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
          }}
        >
          🗑 Delete
        </button>
      </div>

      <h2 style={{ marginTop: 16 }}>📅 {diary.created_at?.slice(0, 10)}</h2>

      <div style={{ marginTop: 20, padding: 20, background: "white", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>

        <p>😄 Emotion: {diary.emotion_en}（{diary.emotion_jp}）</p>
        <p>⚽ Activity: {diary.activity_en}（{diary.activity_jp}）</p>
        <p>🎯 Position: {diary.position_en}（{diary.position_jp}）</p>
        <p>✅ Good: {diary.positive_en}（{diary.positive_jp}）</p>
        <p>🔥 Improve: {diary.negative_en}（{diary.negative_jp}）</p>

        <hr style={{ margin: "24px 0" }} />

        <h3>📜 Diary Sentence (English)</h3>
        <p style={{ whiteSpace: "pre-line" }}>{diary.sentence}</p>

        <h3 style={{ marginTop: 24 }}>🇯🇵 Japanese Summary</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          今日は{diary.activity_jp}で、{diary.position_jp}としてプレーしました。 <br></br> 
          気持ちは「{diary.emotion_jp}」気分です。  <br></br>
          上手くいったことは、{diary.positive_jp}です。
          改善したいことは、{diary.negative_jp}です。  <br></br>
          今日の振り返り：{diary.custom_reflection || diary.reflection_jp || "なし"}
        </p>
      </div>
    </div>
  );
}
