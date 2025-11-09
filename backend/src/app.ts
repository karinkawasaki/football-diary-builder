import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";  // ← これが重要！
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!),
});

// DBの1行がどういう構造かを型で定義
type DiaryRow = RowDataPacket & {
  id: number;
  user_id: number;
  emotion_id: number;
  reflection_id: number;
  custom_reflection: string | null;
  sentence: string;
  created_at: string;
  emotion_en?: string;
  emotion_jp?: string;
  emotion_score?: number;
};

// ✅ ユーザー登録（Supabaseで作られたユーザーを MySQL にも保存する）
app.post("/api/users", async (req, res) => {
  try {
    const { id, email } = req.body;

    await pool.query(
      `INSERT INTO users (id, email) VALUES (?, ?)`,
      [id, email]
    );

    res.json({ message: "User saved in MySQL" });
  } catch (error) {
    console.error("POST /api/users error:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});
app.get("/api/emotions", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM emotions");
  res.json(rows);
});

app.get("/api/activities", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM activities");
  res.json(rows);
});

app.get("/api/positions", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM positions");
  res.json(rows);
});

app.get("/api/positives", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM positives");
  res.json(rows);
});

app.get("/api/negatives", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM negatives");
  res.json(rows);
});

app.get("/api/reflections", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM reflections");
  res.json(rows);
});

// ✅ 日記一覧取得（カレンダー & グラフで使う）
app.get("/api/diaries", async (req, res) => {
  try {
    const user_id  = req.query.user_id;
    if (!user_id) return res.json([]);

    const [rows] = await pool.query(`
      SELECT 
        diaries.id,
        diaries.user_id,
        diaries.created_at,
        diaries.emotion_id,
        diaries.activity_id,
        diaries.position_id,
        diaries.positive_id,
        diaries.negative_id,
        diaries.reflection_id,
        diaries.custom_reflection,
        diaries.sentence,
        emotions.score AS emotion_score,
        emotions.name_en AS emotion_en,
        emotions.name_jp AS emotion_jp
      FROM diaries
      LEFT JOIN emotions ON diaries.emotion_id = emotions.id
      WHERE diaries.user_id = ?
      ORDER BY diaries.created_at DESC
    `, [user_id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch diaries" });
  }
});

// Get single diary by ID
app.get("/api/diaries/:id", async (req, res) => {
  try {
    const diaryId = req.params.id;
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        d.*,

        emo.name_en AS emotion_en,
        emo.name_jp AS emotion_jp,

        act.name_en AS activity_en,
        act.name_jp AS activity_jp,

        pos.name_en AS position_en,
        pos.name_jp AS position_jp,

        posi.name_en AS positive_en,
        posi.name_jp AS positive_jp,

        nega.name_en AS negative_en,
        nega.name_jp AS negative_jp,

        refl.name_en AS reflection_en,
        refl.name_jp AS reflection_jp

      FROM diaries d
      LEFT JOIN emotions emo ON d.emotion_id = emo.id
      LEFT JOIN activities act ON d.activity_id = act.id
      LEFT JOIN positions pos ON d.position_id = pos.id
      LEFT JOIN positives posi ON d.positive_id = posi.id
      LEFT JOIN negatives nega ON d.negative_id = nega.id
      LEFT JOIN reflections refl ON d.reflection_id = refl.id

      WHERE d.id = ?
      `,
      [diaryId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Diary not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch diary" });
  }
});

// ✅ 更新
app.put("/api/diaries/:id", async (req, res) => {
  try {
    const diaryId = req.params.id;

    const {
      emotion_id,
      activity_id,
      position_id,
      positive_id,
      negative_id,
      reflection_id,
      custom_reflection,
      sentence,
    } = req.body; // ←★ここが重要！これがないと赤線になる

    await pool.query(
      `UPDATE diaries SET
        emotion_id = ?,
        activity_id = ?,
        position_id = ?,
        positive_id = ?,
        negative_id = ?,
        reflection_id = ?,
        custom_reflection = ?,
        sentence = ?
      WHERE id = ?`,
      [
        emotion_id,
        activity_id,
        position_id,
        positive_id,
        negative_id,
        reflection_id,
        custom_reflection,
        sentence,
        diaryId,
      ]
    );

    res.json({ message: " Diary updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update diary" });
  }
});



// Delete diary
app.delete("/api/diaries/:id", async (req, res) => {
  try {
    const diaryId = req.params.id;
    await pool.query("DELETE FROM diaries WHERE id = ?", [diaryId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete diary" });
  }
});

// ✅ Master Data Endpoints (フォーム用データ取得)

// 感情
app.get("/api/emotions", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp, score FROM emotions");
  res.json(rows);
});

// 活動
app.get("/api/activities", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp FROM activities");
  res.json(rows);
});

// ポジション
app.get("/api/positions", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp FROM positions");
  res.json(rows);
});

// 良かった点
app.get("/api/positives", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp FROM positives");
  res.json(rows);
});

// 改善したい点
app.get("/api/negatives", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp FROM negatives");
  res.json(rows);
});

// 振り返り
app.get("/api/reflections", async (req, res) => {
  const [rows] = await pool.query("SELECT id, name_en, name_jp FROM reflections");
  res.json(rows);
});

// ✅ ユーザー登録 API（Supabase → MySQL 同期用）
app.post("/api/users", async (req, res) => {
  const { id, email } = req.body;
  try {
    await pool.query(
      "INSERT IGNORE INTO users (id, email) VALUES (?, ?)",
      [id, email]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to create user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/diaries", async (req, res) => {
  try {
    const {
      user_id,
      emotion_id,
      activity_id,
      position_id,
      positive_id,
      negative_id,
      reflection_id,
      custom_reflection,
      sentence,
    } = req.body;

    await pool.query(
      `
      INSERT INTO diaries (
        user_id, emotion_id, activity_id, position_id,
        positive_id, negative_id, reflection_id, custom_reflection, sentence
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id, // ← ✅ ここが UUID のまま入る
        emotion_id,
        activity_id,
        position_id,
        positive_id,
        negative_id,
        reflection_id || null,
        custom_reflection || null,
        sentence,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /api/diaries error:", err);
    res.status(500).json({ error: "Failed to create diary" });
  }
});

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
