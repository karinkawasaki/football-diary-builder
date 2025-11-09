import { useEffect, useState } from "react";
import "./FootballDiaryForm.css";

type Props = {
  onGenerate: (sentence: string, formData: any) => void;
  initialData?: any;
  language?: "en" | "jp" | "both";

  emotions?: any[];
  activities?: any[];
  positions?: any[];
  positives?: any[];
  negatives?: any[];
  reflections?: any[];
};

export default function FootballDiaryForm({
  onGenerate,
  initialData,
  language = "both",
  emotions = [],
  activities = [],
  positions = [],
  positives = [],
  negatives = [],
  reflections = [],
}: Props) {
  const [emotion, setEmotion] = useState("");
  const [activity, setActivity] = useState("");
  const [position, setPosition] = useState("");
  const [success, setSuccess] = useState("");
  const [challenge, setChallenge] = useState("");
  const [reflection, setReflection] = useState("");
  const [customReflection, setCustomReflection] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setEmotion(initialData.emotion_id?.toString() || "");
    setActivity(initialData.activity_id?.toString() || "");
    setPosition(initialData.position_id?.toString() || "");
    setSuccess(initialData.positive_id?.toString() || "");
    setChallenge(initialData.negative_id?.toString() || "");

    if (initialData.custom_reflection) {
      setReflection("other");
      setCustomReflection(initialData.custom_reflection);
    } else {
      setReflection(initialData.reflection_id?.toString() || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!emotion || !activity || !position || !success || !challenge || !reflection) {
      alert("⚠️ 全ての項目を選択してください / Please complete all fields");
      return;
    }

    const formData = {
      emotion_id: Number(emotion),
      activity_id: Number(activity),
      position_id: Number(position),
      positive_id: Number(success),
      negative_id: Number(challenge),
      reflection_id: reflection === "other" ? null : Number(reflection),
      custom_reflection: reflection === "other" ? customReflection : null,
    };

    const emotionData = emotions.find((e) => e.id === Number(emotion));
    const activityData = activities.find((a) => a.id === Number(activity));
    const positionData = positions.find((p) => p.id === Number(position));
    const positiveData = positives.find((p) => p.id === Number(success));
    const negativeData = negatives.find((n) => n.id === Number(challenge));
    const reflectionText =
      reflection === "other"
        ? customReflection
        : reflections.find((r) => r.id === Number(reflection))?.name_en || "";

    const diarySentence = `
Today at ${activityData?.name_en}, I played as a ${positionData?.name_en}.
I felt ${emotionData?.name_en.toLowerCase()}.
My strong point was ${positiveData?.name_en}, and I want to improve ${negativeData?.name_en}.
Reflection: ${reflectionText}.
    `.trim();

    // ✅ ここが一番大事 — sentence + formData を送る
    onGenerate(diarySentence, formData);
  };

  const displayName = (item: any) =>
    language === "en"
      ? item.name_en
      : language === "jp"
      ? item.name_jp
      : `${item.name_en}（${item.name_jp}）`;

  return (
    <div className="diary-form">
      <h3>{initialData ? "✏️ 日記を編集 / Edit Diary" : "📝 今日の日記 / Today's Diary"}</h3>

      <div className="form-row">
        <label>今日はどんな気持ち？ / Emotion</label>
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
          <option value="">選択する / Select</option>
          {emotions.map((e) => (
            <option key={e.id} value={e.id}>{displayName(e)}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>何をした？ / Activity</label>
        <select value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">選択する / Select</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>{displayName(a)}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>ポジション / Position</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">選択する / Select</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>{displayName(p)}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>うまくいったこと / Did well in</label>
        <select value={success} onChange={(e) => setSuccess(e.target.value)}>
          <option value="">選択する / Select</option>
          {positives.map((p) => (
            <option key={p.id} value={p.id}>{displayName(p)}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>改善したいこと / Need to improve</label>
        <select value={challenge} onChange={(e) => setChallenge(e.target.value)}>
          <option value="">選択する / Select</option>
          {negatives.map((n) => (
            <option key={n.id} value={n.id}>{displayName(n)}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>今日の振り返り / Reflection</label>
        <select value={reflection} onChange={(e) => setReflection(e.target.value)}>
          <option value="">選択する / Select</option>
          {reflections.map((r) => (
            <option key={r.id} value={r.id}>{displayName(r)}</option>
          ))}
          <option value="other">その他 / Other</option>
        </select>
      </div>

      {reflection === "other" && (
        <div className="form-row">
          <input
            type="text"
            placeholder="自由に書く / Write freely"
            value={customReflection}
            onChange={(e) => setCustomReflection(e.target.value)}
          />
        </div>
      )}

      <button className="save-btn" onClick={handleSubmit}>
        {initialData ? "保存する / Save" : "作成して保存 / Generate & Save"}
      </button>
    </div>
  );
}