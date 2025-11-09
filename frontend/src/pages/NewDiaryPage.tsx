import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FootballDiaryForm from "../components/FootballDiaryForm";

export default function NewDiaryPage() {
  const navigate = useNavigate();

  const [emotions, setEmotions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [positions, setPositions] = useState([]);
  const [positives, setPositives] = useState([]);
  const [negatives, setNegatives] = useState([]);
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/emotions").then((r) => r.json()),
      fetch("http://localhost:3001/api/activities").then((r) => r.json()),
      fetch("http://localhost:3001/api/positions").then((r) => r.json()),
      fetch("http://localhost:3001/api/positives").then((r) => r.json()),
      fetch("http://localhost:3001/api/negatives").then((r) => r.json()),
      fetch("http://localhost:3001/api/reflections").then((r) => r.json()),
    ]).then(([emo, act, pos, posi, nega, refl]) => {
      setEmotions(emo);
      setActivities(act);
      setPositions(pos);
      setPositives(posi);
      setNegatives(nega);
      setReflections(refl);
    });
  }, []);

  return (
    <div className="page-container">
      <Link to="/">← Back to Calendar</Link>
      <h1>📝 New Diary</h1>

      <FootballDiaryForm
        onGenerate={async (sentence, formData) => {
          const user_id = localStorage.getItem("user_id");

          if (!user_id) {
            alert("You must be logged in.");
            return;
          }

          await fetch("http://localhost:3001/api/diaries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id, // ✅ ログイン中ユーザーを保存
              ...formData,
              sentence,
            }),
          });

          alert("✅ Saved!");
          navigate("/"); // ← window.location.href → navigate()へ統一
        }}
        language="both"
        emotions={emotions}
        activities={activities}
        positions={positions}
        positives={positives}
        negatives={negatives}
        reflections={reflections}
      />
    </div>
  );
}
