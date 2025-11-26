[football_diary.sql](https://github.com/user-attachments/files/23776104/football_diary.sql)
# ⚽ Football Diary Builder

サッカーの練習・試合の振り返りを、  
**英語 × 日本語で自動生成できる日記アプリ**です。

This is a **Football Training Diary App** that allows users to record their daily training and matches, automatically generating a **bilingual (English & Japanese) diary entry**.

---

## 🌟 コンセプト / Concept

- サッカー選手のための「振り返り × 英語学習」アプリ
- 感情・活動・ポジション・良かった点・課題などを選択するだけで、  
  **英語の文章が自動生成**
- すべての表示は **日本語＋英語併記対応**
- カレンダーとグラフで、成長を「見える化」

This app helps football players:
- Reflect on their daily performance
- Learn English through automatically generated diary sentences
- Visualize emotional trends using a calendar and chart

---

## ✨ 主な機能 / Features

✅ ユーザー登録 / ログイン（Supabase Auth）  
✅ 日記の作成・編集・削除  
✅ 英語日記の自動生成（選択式フォーム）  
✅ 日本語＆英語の併記表示  
✅ カレンダー表示（記録済みの日にドット表示）  
✅ 月ごとの感情グラフ（Recharts）  
✅ パスワードリセット機能  
✅ モバイル対応UI  

---

## 🛠 使用技術 / Tech Stack

### Frontend
- React (Vite)
- TypeScript
- React Router
- Recharts
- CSS（レスポンシブ対応・Arsenalテーマ）

### Backend
- Node.js
- Express
- TypeScript

### Database
- MySQL

### Authentication
- Supabase Auth（メール認証・パスワードリセット対応）

---

## 🗂 データ構成 / Database Structure

- users
- diaries
- emotions
- activities
- positions
- positives
- negatives
- reflections

すべてリレーション付きで管理し、  
**日記1件に対して感情・活動・ポジションなどを紐付け**ています。

---

## 📸 スクリーンショット / Screenshots
 
- カレンダー画面
<img width="1470" height="690" alt="Screenshot 2025-11-26 at 17 25 43" src="https://github.com/user-attachments/assets/48a069af-c0e1-4fb2-963c-c169d64c3a75" />
<img width="1455" height="697" alt="Screenshot 2025-11-26 at 17 26 25" src="https://github.com/user-attachments/assets/88c4bc9c-1ce7-462a-829b-698c64a49414" />
<img width="526" height="292" alt="Screenshot 2025-11-26 at 17 28 01" src="https://github.com/user-attachments/assets/d001dc40-f523-4178-8466-2a93f411a872" />


- 新規日記作成画面
 <img width="1458" height="713" alt="Screenshot 2025-11-26 at 17 25 58" src="https://github.com/user-attachments/assets/a3005812-ca29-4468-8e18-3046e63856e2" />

<img width="1462" height="718" alt="Screenshot 2025-11-26 at 17 26 12" src="https://github.com/user-attachments/assets/dac5fd35-3efd-4e7d-9e23-c12604ddec28" />

- 日記一覧
<img width="1462" height="706" alt="Screenshot 2025-11-26 at 17 26 44" src="https://github.com/user-attachments/assets/86870144-6553-4673-aa76-717b09e0bc0b" />

- 日記詳細
<img width="1454" height="703" alt="Screenshot 2025-11-26 at 17 26 54" src="https://github.com/user-attachments/assets/8dbae4df-4357-42f7-ad6a-021ac785cb02" />
<img width="1467" height="704" alt="Screenshot 2025-11-26 at 17 27 04" src="https://github.com/user-attachments/assets/fea02025-6774-4628-89e3-64f91837b15a" />

- ログイン / サインアップ
<img width="1457" height="698" alt="Screenshot 2025-11-26 at 17 27 24" src="https://github.com/user-attachments/assets/2fa2be08-51b3-416f-95b6-35299eaf2b49" />
<img width="1461" height="703" alt="Screenshot 2025-11-26 at 17 27 33" src="https://github.com/user-attachments/assets/5d6ec2c6-cff3-4f13-9f76-d90af7212a6f" />
<img width="1468" height="711" alt="Screenshot 2025-11-26 at 17 27 41" src="https://github.com/user-attachments/assets/fc9e7ae2-b5cc-49c1-9c05-d85a49353d30" />
  

---

## 🚀 ローカルでの起動方法 / How to Run Locally

```bash
npm install
npm run dev
