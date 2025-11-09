import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FootballDiaryForm from "../components/FootballDiaryForm";

export default function EditDiaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<any>(null);

  const [emotions, setEmotions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [positives, setPositives] = useState<any[]>([]);
  const [negatives, setNegatives] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);

  // 日記データフェッチ
  useEffect(() => {
    fetch(`http://localhost:3001/api/diaries/${id}`)
      .then((res) => res.json())
      .then(setDiary);
  }, [id]);

  // マスターデータフェッチ
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

const handleUpdate = async (sentence: string, formData: any) => {
  // フォームは *_id で来る。未入力なら既存の値を使う（保険）
  const payload = {
    emotion_id: Number(formData.emotion_id ?? diary.emotion_id),
    activity_id: Number(formData.activity_id ?? diary.activity_id),
    position_id: Number(formData.position_id ?? diary.position_id),
    positive_id: Number(formData.positive_id ?? diary.positive_id),
    negative_id: Number(formData.negative_id ?? diary.negative_id),
    reflection_id:
      formData.reflection_id === null || formData.reflection_id === undefined
        ? diary.reflection_id
        : Number(formData.reflection_id),
    custom_reflection:
      formData.custom_reflection ?? diary.custom_reflection,
    sentence, // ← 生成文はそのまま送る（再生成されたもの）
  };

  await fetch(`http://localhost:3001/api/diaries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  alert("✅ 更新しました！");
  navigate(`/diary/${id}`);
};

  if (!diary) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ width: 600, margin: "40px auto" }}>
      <h1>✏️ Edit Diary / 日記を編集</h1>

      <FootballDiaryForm
        initialData={diary}
        onGenerate={handleUpdate}
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
