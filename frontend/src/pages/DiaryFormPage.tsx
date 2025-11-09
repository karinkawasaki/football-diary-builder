// frontend/src/pages/DiaryFormPage.tsx
import { useNavigate } from "react-router-dom";
import FootballDiaryForm from "../components/FootballDiaryForm";
import { useEffect, useState } from "react";

export default function DiaryFormPage() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  const [emotions, setEmotions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [positives, setPositives] = useState<any[]>([]);
  const [negatives, setNegatives] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);

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

  const handleCreate = async (sentence: string, formData: any) => {
    const payload = {
      user_id,
      ...formData,
      sentence,
    };

    await fetch("http://localhost:3001/api/diaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ 日記を保存しました");
    navigate("/calendar");
  };

  return (
    <div style={{ width: 600, margin: "40px auto" }}>
      <FootballDiaryForm
        onGenerate={handleCreate}
        emotions={emotions}
        activities={activities}
        positions={positions}
        positives={positives}
        negatives={negatives}
        reflections={reflections}
        language="both"
      />
    </div>
  );
}
