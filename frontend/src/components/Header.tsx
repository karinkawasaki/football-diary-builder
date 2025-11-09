export default function Header() {
  const loggedIn = !!localStorage.getItem("user_id");

  return (
    <header
      style={{
        background: "#9C2F3F",
        color: "white",
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Poppins, Noto Sans JP, sans-serif",
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "20px" }}>
        FOOTBALL DIARY BUILDER
      </div>

      <nav style={{ display: "flex", gap: "22px", fontSize: "15px" }}>
        <a href="/" style={{ color: "white" }}>Calendar</a>
        <a href="/list" style={{ color: "white" }}>Diary List</a>
        <a href="/new" style={{ color: "white" }}>Write Diary</a>

        {loggedIn ? (
          <a
            href="#"
            style={{ color: "white" }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Log out
          </a>
        ) : (
          <>
            <a href="/login" style={{ color: "white" }}>Log in</a>
            <a href="/signup" style={{ color: "white" }}>Sign in</a>
          </>
        )}
      </nav>
    </header>
  );
}
