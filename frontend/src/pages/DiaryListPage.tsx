import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Diary = {
  id: number;
  created_at: string;
  emotion_score?: number;
  sentence?: string;
};

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;
    fetch(`http://localhost:3001/api/diaries?user_id=${user_id}`)
      .then((res) => res.json())
      .then(setDiaries);
  }, [user_id]);

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ marginBottom: "20px", fontWeight: 700 }}>📘 Diary List / 日記一覧</h1>

      {diaries.length === 0 && <p>No diaries yet. Write one! ✏️</p>}

      <div className="diary-grid">
        {diaries.map((d) => (
          <Link to={`/diary/${d.id}`} key={d.id} className="diary-card">
            <div className="date">
              {new Date(d.created_at).toLocaleDateString("ja-JP")}
            </div>
            <div className="content">
              {d.sentence ? d.sentence.slice(0, 40) + "..." : "No text"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
