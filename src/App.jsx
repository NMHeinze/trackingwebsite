import React, { useState } from "react";
import logo from './assets/logo.svg'; // or './assets/logo.png'

// The statuses and their order
const STATUS_STAGES = [
  "Deposit Paid",
  "File Opened",
  "Drafting Application",
  "Editing Application",
  "Putting Together Application",
  "Submitted"
];

function ProgressTracker({ currentStatus }) {
  const currentIndex = STATUS_STAGES.findIndex(
    (status) => status === currentStatus
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "30px 0" }}>
      {STATUS_STAGES.map((status, idx) => (
        <div key={status} style={{
          display: "flex",
          alignItems: "center",
          fontWeight: idx === currentIndex ? "bold" : "normal",
          color: idx === currentIndex ? "#BA232C" : "#666"
        }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: idx <= currentIndex ? "#BA232C" : "#eee",
              marginRight: 10,
              border: "2px solid #BA232C"
            }}
          />
          <span>{status}</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [fileNumber, setFileNumber] = useState("");
  const [surname, setSurname] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Helper: Parse CSV text into objects
  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map(line => {
      const values = line.split(",");
      let row = {};
      headers.forEach((header, i) => {
        row[header.trim()] = values[i]?.trim() || "";
      });
      return row;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);

    // Fetch the CSV file
    const resp = await fetch("/applications.csv");
    const csvText = await resp.text();
    const rows = parseCSV(csvText);

    // Search for match
    const match = rows.find(
      row =>
        row.file_number.toLowerCase() === fileNumber.trim().toLowerCase() &&
        row.surname.toLowerCase() === surname.trim().toLowerCase()
    );

    if (match) {
      setResult(match);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fff',
    }}>
      <div style={{
        maxWidth: 480,
        padding: '32px',
        margin: '0 16px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 32px #BA232C22',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Branding */}
        <img src={logo} alt="NM Heinze Attorneys Logo" style={{ width: 360, display: 'block', margin: '2pt auto 2pt' }} />
        <h2 style={{ color: "#BA232C", textAlign: "center" }}>NM Heinze Attorneys</h2>
        <h3 style={{ color: "#333434", textAlign: "center", marginBottom: 32 }}>Immigration Application Tracker</h3>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label style={{ color: '#333434' }}>File Number<br />
            <input
              type="text"
              value={fileNumber}
              onChange={e => setFileNumber(e.target.value)}
              required
              style={{
                width: "100%", padding: 8, margin: "8px 0 20px", borderRadius: 6, border: "1px solid #ccc"
              }}
              placeholder="e.g. I12345"
            />
          </label>
          <label style={{ color: '#333434' }}>Surname<br />
            <input
              type="text"
              value={surname}
              onChange={e => setSurname(e.target.value)}
              required
              style={{
                width: "100%", padding: 8, margin: "8px 0 24px", borderRadius: 6, border: "1px solid #ccc"
              }}
              placeholder="e.g. Smith"
            />
          </label>
          <button
            type="submit"
            style={{
              background: "#BA232C",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 22px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              marginBottom: 20
            }}
            disabled={loading}
          >
            {loading ? "Searching..." : "Track Application"}
          </button>
        </form>
        {/* Result */}
        {result && (
          <div style={{ textAlign: "center" }}>
            <h4 style={{ color: "#BA232C" }}>Status for File {result.file_number} ({result.surname})</h4>
            <ProgressTracker currentStatus={result.status} />
            <p style={{ fontStyle: "italic", color: "#333434" }}>Current stage: <b>{result.status}</b></p>
          </div>
        )}
        {notFound && (
          <p style={{ color: "#BA232C", textAlign: "center", marginTop: 20 }}>
            Application not found.<br />
            Please check your file number and surname, or contact our office for help.
          </p>
        )}
        {/* Disclaimer */}
        <p style={{
          marginTop: 50,
          fontSize: "0.96em",
          color: "#888",
          textAlign: "center"
        }}>
          For queries or updates, contact NM Heinze Attorneys.<br />
          © {new Date().getFullYear()} NM Heinze Attorneys. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default App;
