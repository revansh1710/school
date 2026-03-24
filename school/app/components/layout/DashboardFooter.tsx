export default function DashboardFooter() {
  return (
    <footer style={{
      marginTop: "auto",
      padding: "1rem 2rem",
      borderTop: "1px solid #eee",
      fontSize: "0.8rem",
      color: "#777",
      textAlign: "center",
      background: "#fff"
    }}>
      © {new Date().getFullYear()} School Portal • All rights reserved
    </footer>
  )
}