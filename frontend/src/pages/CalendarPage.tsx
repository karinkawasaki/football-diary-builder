// frontend/src/pages/CalendarPage.tsx
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import MoodChart from "../components/MoodChart";
import Modal from "../components/Modal"; // ← ここが大事！
import "./CalendarPage.css";

type Diary = {
  id: number;
  created_at: string;
  emotion_score?: number;
  emotion_en?: string;
  emotion_jp?: string;
  activity_jp?: string;
  position_jp?: string;
  positive_jp?: string;
  negative_jp?: string;
  sentence?: string;
};

export default function CalendarPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);

  const username = localStorage.getItem("username") || "My";
  const user_id = localStorage.getItem("user_id");

  // 📌 日記取得
  useEffect(() => {
    if (!user_id) return;
    fetch(`http://localhost:3001/api/diaries?user_id=${user_id}`)
      .then((res) => res.json())
      .then(setDiaries)
      .catch(console.error);
  }, [user_id]);

  // 📌 日付比較用
  const normalize = (date: string | Date) => {
    const d = new Date(date);
    d.setHours(d.getHours() + 9);
    return d.toISOString().split("T")[0];
  };

  // 📌 日付クリック → モーダルで閲覧
  const handleDayClick = async (date: Date) => {
    const clicked = normalize(date);
    const diary = diaries.find((d) => normalize(d.created_at) === clicked);

    if (!diary) {
      setSelectedDiary(null);
      return;
    }

    // ✅ 詳細データを取得して Modal に渡す
    const res = await fetch(`http://localhost:3001/api/diaries/${diary.id}`);
    const fullDiary = await res.json();
    setSelectedDiary(fullDiary);
  };

  // 📌 月の表示分だけグラフに渡す
  const filteredDiaries = diaries.filter((d) => {
    const date = new Date(d.created_at);
    return (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth()
    );
  });

  // 📌 カレンダーの日付に日記がある場合、赤丸表示
  const tileClassName = ({ date }: { date: Date }) => {
    const target = normalize(date);
    const entry = diaries.find((d) => normalize(d.created_at) === target);
    return entry ? "has-diary" : "";
  };

  return (
    <div className="calendar-container">
      <h1>📅 {username}'s Football Diary</h1>
      <p className="subtitle">📝 サッカーの振り返り / Football Reflection</p>

      <Link to="/new" className="add-btn">
        ＋ Write New Diary / 日記を書く
      </Link>

      <div className="calendar-card">
        <Calendar
          onClickDay={handleDayClick}
          tileClassName={tileClassName}
          tileContent={({ date }) => {
            const target = normalize(date);
            const entry = diaries.find((d) => normalize(d.created_at) === target);
            return entry ? <div className="mood-dot" /> : null;
          }}
          onActiveStartDateChange={({ activeStartDate }) =>
            setCurrentDate(activeStartDate!)
          }
        />
      </div>

      {/* 🗒 今月の日記数 */}
      <p className="month-count">
        📌 今月の日記: {filteredDiaries.length} 件 / This month: {filteredDiaries.length} entries
      </p>

      <MoodChart diaries={filteredDiaries} />

      {/* ✅ モーダル表示 */}
      <Modal isOpen={!!selectedDiary} onClose={() => setSelectedDiary(null)}>
        {selectedDiary && (
          <>
            <h2>📄 {selectedDiary.created_at.slice(0, 10)}</h2>

            <p><b>Emotion:</b> {selectedDiary.emotion_en}（{selectedDiary.emotion_jp}）</p>
            <hr style={{ margin: "12px 0" }} />

            <p style={{ whiteSpace: "pre-line", marginBottom: 12 }}>
              {selectedDiary.sentence}
            </p>

            <p className="jp-summary">
              🇯🇵 今日は{selectedDiary.activity_jp}で、
              {selectedDiary.position_jp}としてプレーしました。 <br></br> 
              よかった点：{selectedDiary.positive_jp}  <br></br>
              改善点：{selectedDiary.negative_jp}
            </p>

            <Link
              to={`/diary/${selectedDiary.id}`}
              style={{ display: "inline-block", marginTop: 16, color: "#9C2F3F" }}
            >
             → 詳細ページを開く
            </Link>
          </>
        )}
      </Modal>
    </div>
  );
}
