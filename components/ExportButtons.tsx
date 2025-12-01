"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Download failed: ${res.status}`);
  }
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export function ExportButtons() {
  const handleExportCsv = async () => {
    try {
      await downloadFile(`${API_BASE}/export/csv`, "wellbeing_conversations.csv");
    } catch (err) {
      console.error(err);
      alert("Không tải được CSV.");
    }
  };

  const handleExportReport = async () => {
    try {
      await downloadFile(`${API_BASE}/export/report`, "wellbeing_reports.zip");
    } catch (err) {
      console.error(err);
      alert("Không tải được Wellbeing Report.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
      <button
        onClick={handleExportCsv}
        style={{
          padding: "6px 12px",
          background: "#fafafa",
          border: "1px solid #ccc",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Export CSV
      </button>

      <button
        onClick={handleExportReport}
        style={{
          padding: "6px 12px",
          background: "#fafafa",
          border: "1px solid #ccc",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Download Wellbeing Report
      </button>
    </div>
  );
}
