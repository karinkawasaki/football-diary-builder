import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Diary = {
  created_at: string;
  emotion_score?: number;
};

type Props = {
  diaries: Diary[];
};

// ◆ ダイヤ型マーカー
const DiamondDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <polygon
      points={`${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}`}
      fill="#9C2F3F"
      stroke="#9C2F3F"
    />
  );
};

// ✅ スコアテーブルに型をつける
const moodLabels: Record<0 | 1 | 2 | 3 | 4, { en: string; jp: string }> = {
  0: { en: "Terrible", jp: "最悪" },
  1: { en: "Bad", jp: "悪い" },
  2: { en: "Okay", jp: "普通" },
  3: { en: "Good", jp: "良い" },
  4: { en: "Great", jp: "とても良い" },
};

// ✅ スコアを 0〜4に丸める関数
const normalizeScore = (value: number | undefined): 0 | 1 | 2 | 3 | 4 => {
  const s = Math.max(0, Math.min(4, value ?? 0));
  return s as 0 | 1 | 2 | 3 | 4;
};

// ✅ Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const score = normalizeScore(payload[0].value);
  const mood = moodLabels[score];

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
      }}
    >
      <strong>{mood.en}</strong> / {mood.jp}
    </div>
  );
};

export default function MoodChart({ diaries }: Props) {
  const data = diaries.map((d) => ({
    date: new Date(d.created_at).getDate(),
    score: d.emotion_score ?? 0,
  }));

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "40px auto" }}>
      <h3 style={{ marginBottom: "12px" }}>📈 Mood Trend / 今月の気持ち推移</h3>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid stroke="#F4E9E4" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#9C2F3F"
            strokeWidth={3}
            dot={<DiamondDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
