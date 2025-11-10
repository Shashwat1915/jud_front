// src/MainApp.jsx
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { useAuth } from "./AuthContext";

// --- SVG ICONS ---
const iconProps = { width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
const BotIcon = () => <svg {...iconProps}><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>;
const UserIcon = () => <svg {...iconProps}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const FileTextIcon = () => <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-6-5z" /><polyline points="14 2 14 7 19 7" /></svg>;
const ScaleIcon = () => <svg {...iconProps}><path d="m16 16 3-8 3 8c-2 1-4 1-6 0" /><path d="m2 16 3-8 3 8c-2 1-4 1-6 0" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2" /><path d="M19 7h2" /></svg>;
const WaypointsIcon = () => <svg {...iconProps}><circle cx="12" cy="12" r="3" /><path d="M12 19v-3.5" /><path d="M12 8.5V5" /><path d="M5 12h3.5" /><path d="M15.5 12H19" /></svg>;
const SwordsIcon = () => <svg {...iconProps}><path d="m14.5 2-2.5 2.5 5 5L19.5 7" /><path d="m9.5 7-5 5 2.5 2.5 5-5" /><path d="M2.5 21.5 7 17" /><path d="m17 7-5 5" /></svg>;
const DashboardIcon = () => <svg {...iconProps}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
const SendIcon = () => <svg {...iconProps} strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const UploadCloudIcon = () => <svg {...iconProps}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>;

// 🌞 Light mode icon
const SunIcon = () => (
  <svg {...iconProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" /></svg>
);

// 🌙 Dark mode icon
const MoonIcon = () => (
  <svg {...iconProps}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
);

// API Base URL (backend)
const API_BASE_URL = "http://localhost:5000";

// --- Skeleton Loader ---
const SkeletonLoader = () => (
  <div className="card skeleton-loader">
    <div className="title"></div>
    <div className="line"></div>
    <div className="line" style={{ width: "80%" }}></div>
  </div>
);

// --- Theme Toggle ---
const ThemeToggle = ({ theme, setTheme }) => (
  <div className="theme-toggle">
    <button
      className={`toggle-button ${theme === "light" ? "active" : ""}`}
      onClick={() => setTheme("light")}
    >
      <SunIcon />
    </button>
    <button
      className={`toggle-button ${theme === "dark" ? "active" : ""}`}
      onClick={() => setTheme("dark")}
    >
      <MoonIcon />
    </button>
  </div>
);

// --- Dashboard Page ---
const DashboardPage = ({ setCurrentPage, activityLog }) => (
  <div className="page-container">
    <div className="page-header">
      <h1>Welcome to Judicio</h1>
      <p>Select a feature below to begin.</p>
    </div>
    <div className="bento-grid">
      <div className="bento-card span-2" onClick={() => setCurrentPage("chatbot")}><BotIcon /><h3>Law Advisor Chat</h3><p>Ask legal questions in plain English and get AI-based insights.</p></div>
      <div className="bento-card" onClick={() => setCurrentPage("predictor")}><ScaleIcon /><h3>Case Predictor</h3><p>Predict outcomes based on facts and jurisdiction.</p></div>
      <div className="bento-card span-3" onClick={() => setCurrentPage("analyzer")}><FileTextIcon /><h3>Document Analyzer</h3><p>Upload PDFs or Word docs for AI-based summaries and key clauses.</p></div>
      <div className="bento-card" onClick={() => setCurrentPage("visualizer")}><WaypointsIcon /><h3>Case Flow</h3><p>Generate a chronological event timeline from facts.</p></div>
      <div className="bento-card" onClick={() => setCurrentPage("arguments")}><SwordsIcon /><h3>Argument Strategist</h3><p>Generate arguments for or against a case position.</p></div>
    </div>
    <div className="activity-log">
      <h2>Recent Activity</h2>
      {activityLog.length > 0
        ? activityLog.map((act, i) => (
            <div key={i} className="activity-item">
              {act.icon}
              <p>{act.action}</p>
              <span>{act.timestamp}</span>
            </div>
          ))
        : <p className="no-activity">No activity recorded yet.</p>}
    </div>
  </div>
);


// --- Chatbot Page ---
const ChatbotPage = ({ logActivity }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I’m Judicio, your AI Law Advisor. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userMsg },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      // Send request to backend
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `The user asks a legal question: ${userMsg}`,
        }),
      });

      // Handle server response
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      // Backend returns { text: "response" }
      const aiResponse =
        data.text || "⚠️ No response from Judicio server.";

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiResponse },
      ]);

      // Log user activity
      logActivity({
        action: `Asked: "${userMsg.substring(0, 30)}..."`,
        icon: <BotIcon />,
      });
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "⚠️ Could not connect to Judicio server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container chat-page">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-avatar ${msg.sender}`}>
              {msg.sender === "ai" ? <BotIcon /> : <UserIcon />}
            </div>
            <div className={`message-bubble ${msg.sender}`}>{msg.text}</div>
          </div>
        ))}
        {isLoading && <SkeletonLoader />}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};


// --- Document Analyzer Page ---
const DocumentAnalyzerPage = ({ logActivity }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("http://localhost:5000/api/analyze-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);
      logActivity({ action: `Analyzed: ${file.name}`, icon: <FileTextIcon /> });
    } catch (error) {
      console.error("Frontend analysis error:", error);
      setAnalysisResult({
        summary: "⚠️ Could not connect to Judicio server.",
        clauses: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1>Document Analyzer</h1></div>

      <div className="card">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />
        <label htmlFor="file-upload" className="upload-label">
          <UploadCloudIcon />
          <p>{file ? file.name : "Click to upload document"}</p>
        </label>

        <button
          className="action-button"
          onClick={handleAnalyze}
          disabled={!file || isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {isLoading && <SkeletonLoader />}

      {analysisResult && (
        <div className="card result-display">
          <h3>Detected Language: {analysisResult.language}</h3>
          <h4>Summary:</h4>
          <p>{analysisResult.summary}</p>

          {analysisResult.clauses?.length > 0 && (
            <>
              <h4>Key Clauses:</h4>
              <ul>
                {analysisResult.clauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};


// --- Case Predictor Page ---
const CasePredictorPage = ({ logActivity }) => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    const formData = Object.fromEntries(new FormData(formRef.current).entries());
    const { caseType, jurisdiction, summary } = formData;

    try {
      const res = await fetch(`${API_BASE_URL}/predict-outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType, jurisdiction, summary }),
      });

      const data = await res.json();
      setPrediction(data);
      logActivity({ action: `Predicted: ${caseType}`, icon: <ScaleIcon /> });
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction({
        outcome: "⚠️ Could not connect to Judicio server.",
        reasoning: "",
        confidence: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Case Predictor</h1>
        <p>Predict case outcomes using a prefilled example or your own input.</p>
      </div>

      <div className="card">
        <form ref={formRef} onSubmit={handlePredict}>
          <div className="form-group">
            <label>Case Type</label>
            <input
              name="caseType"
              defaultValue="Breach of Contract"
              placeholder="e.g., Property dispute"
              required
            />
          </div>

          <div className="form-group">
            <label>Jurisdiction</label>
            <input
              name="jurisdiction"
              defaultValue="Delhi High Court, India"
              required
            />
          </div>

          <div className="form-group">
            <label>Case Summary</label>
            <textarea
              name="summary"
              rows="5"
              required
              defaultValue="The plaintiff alleges that the defendant failed to deliver goods as per the contract despite multiple reminders. The defendant claims force majeure due to COVID-19 lockdown."
            />
          </div>

          <button className="action-button" type="submit" disabled={isLoading}>
            {isLoading ? "Predicting..." : "Predict Outcome"}
          </button>
        </form>
      </div>

      {isLoading && <SkeletonLoader />}

      {prediction && (
        <div className="card result-display">
          <h3>Outcome Prediction</h3>
          <p><strong>Outcome:</strong> {prediction.outcome}</p>
          <p><strong>Reasoning:</strong> {prediction.reasoning}</p>
          <p><strong>Confidence:</strong> {prediction.confidence}</p>
        </div>
      )}
    </div>
  );
};


// --- Case Flow Page ---
const CaseFlowPage = ({ logActivity }) => {
  const [input, setInput] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setTimeline([]);

    try {
      const res = await fetch("http://localhost:5000/generate-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseFacts: input }),
      });

      const data = await res.json();
      setTimeline(data);
      logActivity({ action: "Generated Case Timeline", icon: <WaypointsIcon /> });
    } catch (error) {
      console.error("Timeline generation error:", error);
      setTimeline([{ date: "Error", event: "⚠️ Could not connect to Judicio server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Case Flow</h1>
        <p>Generate a timeline of events from legal case facts.</p>
      </div>

      <div className="card">
        <textarea
          rows="6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter case details here..."
        />
        <button onClick={handleGenerate} className="action-button" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Timeline"}
        </button>
      </div>

      {isLoading && <SkeletonLoader />}

      {timeline.length > 0 && (
        <div className="card result-display">
          <h3>Timeline</h3>
          <ul>
            {timeline.map((t, i) => (
              <li key={i}>
                <strong>{t.date}</strong>: {t.event}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



// --- Argument Strategist Page ---
const ArgumentsPage = ({ logActivity }) => {
  const [type, setType] = useState("for");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResults([]);

    const formData = Object.fromEntries(new FormData(formRef.current).entries());
    const { coreArgument } = formData;

    try {
      const res = await fetch(`${API_BASE_URL}/generate-arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coreArgument, argumentType: type }),
      });

      const data = await res.json();
      setResults(data);
      logActivity({ action: `Generated ${type} arguments`, icon: <SwordsIcon /> });
    } catch (error) {
      console.error("Argument generation error:", error);
      setResults([{ argument: "⚠️ Could not connect to Judicio server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Argument Strategist</h1>
        <p>Generate structured legal arguments using a default case or your own.</p>
      </div>

      <div className="card">
        <form ref={formRef} onSubmit={handleGenerate}>
          <div className="argument-type-toggle">
            <button type="button" onClick={() => setType("for")} className={type === "for" ? "active" : ""}>For</button>
            <button type="button" onClick={() => setType("against")} className={type === "against" ? "active" : ""}>Against</button>
          </div>

          <textarea
            name="coreArgument"
            rows="5"
            required
            defaultValue="The defendant claims that due to the COVID-19 lockdown, the non-delivery of goods falls under the force majeure clause."
          />

          <button className="action-button" type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Arguments"}
          </button>
        </form>
      </div>

      {isLoading && <SkeletonLoader />}

      {results.length > 0 && (
        <div className="arguments-container">
          {results.map((r, i) => (
            <div key={i} className="card argument-card">
              <h4>{r.argument}</h4>
              {r.analysis && <p><strong>Analysis:</strong> {r.analysis}</p>}
              {r.response && <p><strong>Strategy:</strong> {r.response}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- Main Application ---
export default function MainApp() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [activityLog, setActivityLog] = useState([]);
  const [theme, setTheme] = useState(() => {
    // read persisted theme or default to light
    try {
      return localStorage.getItem("judicio_theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    try { localStorage.setItem("judicio_theme", theme); } catch {}
  }, [theme]);

  const logActivity = (newActivity) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActivityLog(prev => [{ ...newActivity, timestamp }, ...prev.slice(0, 4)]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage setCurrentPage={setCurrentPage} activityLog={activityLog} />;
      case "chatbot": return <ChatbotPage logActivity={logActivity} />;
      case "analyzer": return <DocumentAnalyzerPage logActivity={logActivity} />;
      case "predictor": return <CasePredictorPage logActivity={logActivity} />;
      case "visualizer": return <CaseFlowPage logActivity={logActivity} />;
      case "arguments": return <ArgumentsPage logActivity={logActivity} />;
      default: return <DashboardPage setCurrentPage={setCurrentPage} activityLog={activityLog} />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon"><ScaleIcon /></div>
          <h1 className="sidebar-title">Judicio</h1>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setCurrentPage("dashboard")} className={`nav-button ${currentPage === "dashboard" ? "active" : ""}`}><DashboardIcon /><span>Dashboard</span></button>
          <button onClick={() => setCurrentPage("chatbot")} className={`nav-button ${currentPage === "chatbot" ? "active" : ""}`}><BotIcon /><span>Law Chat</span></button>
          <button onClick={() => setCurrentPage("analyzer")} className={`nav-button ${currentPage === "analyzer" ? "active" : ""}`}><FileTextIcon /><span>Analyzer</span></button>
          <button onClick={() => setCurrentPage("predictor")} className={`nav-button ${currentPage === "predictor" ? "active" : ""}`}><ScaleIcon /><span>Predictor</span></button>
          <button onClick={() => setCurrentPage("visualizer")} className={`nav-button ${currentPage === "visualizer" ? "active" : ""}`}><WaypointsIcon /><span>Case Flow</span></button>
          <button onClick={() => setCurrentPage("arguments")} className={`nav-button ${currentPage === "arguments" ? "active" : ""}`}><SwordsIcon /><span>Arguments</span></button>
        </nav>

        <div style={{ marginTop: "auto", padding: "12px" }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={logout} className="nav-button logout" style={{ marginTop: 12 }}><span>Logout</span></button>
        </div>
      </aside>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}
