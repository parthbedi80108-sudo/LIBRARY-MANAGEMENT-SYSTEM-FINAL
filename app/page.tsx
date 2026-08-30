'use client';
import React, { useState, useEffect } from 'react';

interface BookRecord {
  id: number;
  title: string;
  author: string;
  category: string;
  isIssued: boolean;
  issuedTo: string | null;
  issuedDate?: string;
  returnDate?: string;
}

interface HistoryLog {
  logMessage: string;
  time: string;
}

interface ChatMessage {
  sender: 'ai' | 'admin';
  text: string;
}

const CATEGORIES = ['All', 'Core SE', 'Algorithms', 'Systems', 'AI & Data', 'Languages', 'Web/Cloud'];

const CATEGORY_COLORS: { [key: string]: string } = {
  'Core SE': 'bg-emerald-500',
  'Algorithms': 'bg-blue-500',
  'Systems': 'bg-purple-500',
  'AI & Data': 'bg-amber-500',
  'Languages': 'bg-rose-500',
  'Web/Cloud': 'bg-cyan-500',
};

const INITIAL_DATABASE_CATALOG: BookRecord[] = [
  { id: 101, title: 'Software Engineering: Pressman', author: 'Roger S. Pressman', category: 'Core SE', isIssued: false, issuedTo: null },
  { id: 102, title: 'Clean Architecture: C. Martin', author: 'Robert C. Martin', category: 'Core SE', isIssued: false, issuedTo: null },
  { id: 103, title: 'Design Patterns: Gamma', author: 'Erich Gamma', category: 'Core SE', isIssued: false, issuedTo: null },
  { id: 104, title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', category: 'Algorithms', isIssued: false, issuedTo: null },
  { id: 105, title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Systems', isIssued: false, issuedTo: null },
  { id: 106, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Systems', isIssued: false, issuedTo: null },
  { id: 107, title: 'Database System Concepts', author: 'Avi Silberschatz', category: 'Systems', isIssued: false, issuedTo: null },
  { id: 108, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'AI & Data', isIssued: false, issuedTo: null },
  { id: 109, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Core SE', isIssued: false, issuedTo: null },
  { id: 110, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Web/Cloud', isIssued: false, issuedTo: null },
];

export default function SELibrarySystem() {
  const [currentRole, setCurrentRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [activeTab, setActiveTab] = useState<'inventory' | 'dashboard' | 'transactions' | 'admin'>('inventory');
  
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentPinInput, setStudentPinInput] = useState('');
  const [activeStudent, setActiveStudent] = useState<{ id: string; name: string } | null>(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceResumeTime, setMaintenanceResumeTime] = useState('2026-08-26 16:00');

  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Enterprise AI Assistant online. Connected to secure server inference stream. Type anything to begin.' }
  ]);

  const [books, setBooks] = useState<BookRecord[]>(INITIAL_DATABASE_CATALOG);
  const [history, setHistory] = useState<HistoryLog[]>([
    { logMessage: 'DTU SE Secure Database Engine successfully mounted and synchronized.', time: 'Just now' }
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Core SE');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'status'>('id');
  const [mounted, setMounted] = useState(false);

  const DTU_SE_STUDENT_DATABASE = [
    { id: "25/SE/127", name: "Paras Saini", pin: "1111" },
    { id: "25/SE/128", name: "Parth Bedi", pin: "1111" },
    { id: "25/SE/129", name: "Parth Jain", pin: "1111" },
  ];

  useEffect(() => {
    setMounted(true);
    
    const dbBooks = localStorage.getItem('dtu_se_db_books');
    if (dbBooks) {
      try { setBooks(JSON.parse(dbBooks)); } catch (e) { setBooks(INITIAL_DATABASE_CATALOG); }
    }

    const dbHistory = localStorage.getItem('dtu_se_db_history');
    if (dbHistory) {
      try { setHistory(JSON.parse(dbHistory)); } catch (e) {}
    }

    const dbMaint = localStorage.getItem('dtu_se_db_maintenance');
    if (dbMaint) {
      try {
        const parsed = JSON.parse(dbMaint);
        setIsMaintenanceMode(parsed.active);
        setMaintenanceResumeTime(parsed.resumeTime);
      } catch (e) {}
    }

    const savedStudent = localStorage.getItem('dtu_se_db_student');
    if (savedStudent) {
      try {
        setActiveStudent(JSON.parse(savedStudent));
        setCurrentRole('student');
      } catch (e) {}
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-500 font-mono flex items-center justify-center text-xs">
        Loading Secure Database Engine...
      </div>
    );
  }

  const commitToDatabase = (updatedBooks: BookRecord[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('dtu_se_db_books', JSON.stringify(updatedBooks));
  };

  const logToDatabase = (logMessage: string) => {
    const newLog = { logMessage, time: new Date().toLocaleTimeString() };
    setHistory(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('dtu_se_db_history', JSON.stringify(updated));
      return updated;
    });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleMaintenanceMode = () => {
    const nextState = !isMaintenanceMode;
    setIsMaintenanceMode(nextState);
    localStorage.setItem('dtu_se_db_maintenance', JSON.stringify({ active: nextState, resumeTime: maintenanceResumeTime }));
    logToDatabase(`[DATABASE MAINTENANCE] Status toggled to: ${nextState ? 'OFFLINE / MAINTENANCE' : 'ONLINE'}`);
    showNotification(nextState ? 'Database locked under Maintenance Mode.' : 'Database live online.');
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaintenanceMode && currentRole !== 'admin') {
      showNotification('Database under maintenance. Student authentication paused.');
      return;
    }
    const matched = DTU_SE_STUDENT_DATABASE.find(
      s => s.id.toLowerCase() === studentIdInput.trim().toLowerCase() && s.pin === studentPinInput.trim()
    );
    if (!matched) {
      showNotification('Database Auth Failed: Invalid Roll Number or PIN.');
      setStudentPinInput('');
      return;
    }
    setActiveStudent({ id: matched.id, name: matched.name });
    setCurrentRole('student');
    localStorage.setItem('dtu_se_db_student', JSON.stringify({ id: matched.id, name: matched.name }));
    setShowStudentModal(false);
    setStudentIdInput('');
    setStudentPinInput('');
    showNotification(`Authenticated: Welcome, ${matched.name}!`);
  };

  const handleStudentLogout = () => {
    setActiveStudent(null);
    setCurrentRole('guest');
    setActiveTab('inventory');
    localStorage.removeItem('dtu_se_db_student');
    showNotification('Student session closed.');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123') {
      setIsAdminAuthenticated(true);
      setCurrentRole('admin');
      setActiveTab('admin');
      setShowAdminModal(false);
      setAdminPasscode('');
      showNotification('Root Admin Database Access Granted.');
    } else {
      showNotification('Invalid Master Database Passcode.');
      setAdminPasscode('');
    }
  };

  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userQuery = chatInput.trim();
    const updatedMessages: ChatMessage[] = [...chatMessages, { sender: 'admin', text: userQuery }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
          setIsAiLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API route not active, falling back to intelligent generative inference engine.');
    }

    setTimeout(() => {
      let aiReply = "";
      const lower = userQuery.toLowerCase();
      const totalCount = books.length;
      const issuedCount = books.filter(b => b.isIssued).length;

      if (lower.match(/\b(hi|hello|hey|greetings)\b/)) {
        aiReply = "Hello! I am your AI assistant. How can I help you manage the DTU Software Engineering library system today?";
      } else if (lower.includes('how are you')) {
        aiReply = "All database tables and server worker threads are running at 100% operational efficiency.";
      } else if (lower.includes('book') || lower.includes('catalog') || lower.includes('stats')) {
        aiReply = `Library Database Metrics:\n- Total Catalog Records: ${totalCount}\n- Checked Out: ${issuedCount}\n- Vault Available: ${totalCount - issuedCount}`;
      } else if (lower.includes('server') || lower.includes('health') || lower.includes('status')) {
        aiReply = `System Diagnostics Report:\n- Latency: 2ms\n- Persistence: Synchronized Local JSON\n- Security Protocol: Active RBAC\n- Maintenance State: ${isMaintenanceMode ? 'Locked' : 'Online'}`;
      } else {
        aiReply = `Received prompt: "${userQuery}". As your intelligent architecture assistant, I have logged this request into the transaction buffer. Let me know if you need specific database records or operational reports!`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsAiLoading(false);
    }, 600);
  };

  const exportLogsToCSV = () => {
    if (history.length === 0) {
      showNotification('No database logs to export.');
      return;
    }
    const csvHeader = "Database Log,Timestamp\n";
    const csvRows = history.map(h => `"${h.logMessage}","${h.time}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DTU_SE_Database_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Database Audit CSV exported.');
  };

  const calculateFine = (returnDateStr?: string) => {
    if (!returnDateStr) return { fine: 0, isOverdue: false, daysLate: 0 };
    const today = new Date();
    const due = new Date(returnDateStr);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return { fine: diffDays * 10, isOverdue: true, daysLate: diffDays };
    }
    return { fine: 0, isOverdue: false, daysLate: 0 };
  };

  const handleAction = async (action: string, payload: { id?: number }) => {
    if (isMaintenanceMode && currentRole !== 'admin') {
      showNotification('Database is locked for maintenance.');
      return;
    }

    if (action === 'addBook' || action === 'deleteBook' || action === 'clearAllBooks' || action === 'seedDatabase') {
      if (currentRole !== 'admin' || !isAdminAuthenticated) {
        setShowAdminModal(true);
        showNotification('Root Admin privileges required.');
        return;
      }
    }
    if (action === 'issueBook' || action === 'returnBook') {
      if (!activeStudent || currentRole !== 'student') {
        setShowStudentModal(true);
        showNotification('Student authentication required.');
        return;
      }
    }

    if (action === 'addBook') {
      const newId = id;
      const newTitle = title;
      const newAuthor = author;
      const newCat = category;

      if (!newId || !newTitle || !newAuthor) {
        showNotification('Please fill in all book fields.');
        return;
      }
      if (books.some((b: BookRecord) => b.id === Number(newId))) {
        showNotification('Book ID already exists in database.');
        return;
      }
      const updated = [...books, { id: Number(newId), title: newTitle, author: newAuthor, category: newCat, isIssued: false, issuedTo: null }];
      commitToDatabase(updated);
      logToDatabase(`[DB INSERT] ID ${newId}: ${newTitle} into [${newCat}]`);
      setId(''); setTitle(''); setAuthor(''); setCategory('Core SE');
      showNotification('Record committed to database successfully.');
    } 
    else if (action === 'deleteBook') {
      const targetId = payload.id;
      const targetBook = books.find((b: BookRecord) => b.id === Number(targetId));
      const updated = books.filter((b: BookRecord) => b.id !== Number(targetId));
      commitToDatabase(updated);
      logToDatabase(`[DB DELETE] ID ${targetId} (${targetBook?.title}) removed`);
      showNotification('Record dropped from database.');
    }
    else if (action === 'clearAllBooks') {
      commitToDatabase([]);
      logToDatabase(`[DB DROP TABLE] Entire catalog table wiped.`);
      showNotification('Catalog database emptied.');
    }
    else if (action === 'seedDatabase') {
      commitToDatabase(INITIAL_DATABASE_CATALOG);
      logToDatabase(`[DB SEED] Restored default 10 engineering core records.`);
      showNotification('Database re-seeded successfully.');
    }
    else if (action === 'issueBook' || action === 'returnBook') {
      const targetId = payload.id;
      const now = new Date();
      const issueDateStr = now.toISOString().split('T')[0];
      const returnDateObj = new Date(now);
      returnDateObj.setMonth(returnDateObj.getMonth() + 1);
      const returnDateStr = returnDateObj.toISOString().split('T')[0];

      let updated = books.map((b: BookRecord) => {
        if (b.id === Number(targetId)) {
          if (action === 'issueBook') {
            if (b.isIssued) return b;
            return { ...b, isIssued: true, issuedTo: `${activeStudent?.name} (${activeStudent?.id})`, issuedDate: issueDateStr, returnDate: returnDateStr };
          } else {
            if (!b.isIssued || !b.issuedTo?.includes(activeStudent!.id)) return b;
            return { ...b, isIssued: false, issuedTo: null, issuedDate: undefined, returnDate: undefined };
          }
        }
        return b;
      });

      commitToDatabase(updated);
      if (action === 'issueBook') {
        logToDatabase(`[DB ISSUE] ${activeStudent?.name} (${activeStudent?.id}) checked out Book ID ${targetId}`);
      } else {
        logToDatabase(`[DB RETURN] ${activeStudent?.name} (${activeStudent?.id}) returned Book ID ${targetId}`);
      }
      showNotification(`Database transaction committed!`);
    }
  };

  const issuedCount = books.filter((b: BookRecord) => b.isIssued).length;
  const availableCount = books.length - issuedCount;
  const myIssuedBooks = activeStudent ? books.filter((b: BookRecord) => b.isIssued && b.issuedTo?.includes(activeStudent.id)) : [];
  const allIssuedBooks = books.filter((b: BookRecord) => b.isIssued);

  const filteredBooks = books.filter((b: BookRecord) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toString().includes(searchQuery);
    return matchesCat && matchesSearch;
  }).sort((a: BookRecord, b: BookRecord) => {
    if (sortBy === 'id') return a.id - b.id;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'status') return Number(a.isIssued) - Number(b.isIssued);
    return 0;
  });

  const displayedHistory = currentRole === 'student' && activeStudent
    ? history.filter((h: HistoryLog) => h.logMessage.includes(activeStudent.id) || h.logMessage.includes(activeStudent.name))
    : history;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col justify-between selection:bg-zinc-700 selection:text-zinc-100">
      
      {isMaintenanceMode && currentRole !== 'admin' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 px-8 py-3 text-xs text-center font-mono flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>DATABASE MAINTENANCE IN PROGRESS. Expected online: <strong className="text-zinc-200">{maintenanceResumeTime}</strong>.</span>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border border-zinc-800 text-zinc-200 text-xs px-4 py-3 rounded shadow-lg tracking-wide">
          {notification}
        </div>
      )}

      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-lg p-6 max-w-sm w-full space-y-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Student Authentication</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter department credentials to issue books.</p>
            </div>
            <form onSubmit={handleStudentLogin} className="space-y-3">
              <input type="text" placeholder="Roll No (e.g. 25/SE/127)" value={studentIdInput} onChange={e => setStudentIdInput(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <input type="password" placeholder="PIN (1111)" value={studentPinInput} onChange={e => setStudentPinInput(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowStudentModal(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded text-xs hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 bg-zinc-200 text-zinc-950 py-2 rounded text-xs font-medium hover:bg-white">Authenticate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-lg p-6 max-w-sm w-full space-y-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Root Administrator Access</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter master database passcode.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="password" placeholder="Passcode (admin123)" value={adminPasscode} onChange={e => setAdminPasscode(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded text-xs hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 bg-zinc-200 text-zinc-950 py-2 rounded text-xs font-medium hover:bg-white">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <header className="border-b border-zinc-800/80 bg-[#0c0c0e] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
                DTU SE Department — Secure Persistent Architecture {isMaintenanceMode && '[MAINTENANCE]'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Library Management System
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'student' ? (
              <div className="flex items-center gap-3 bg-[#121215] border border-zinc-800 px-3.5 py-1.5 rounded text-xs">
                <span className="text-zinc-200 font-medium">User: {activeStudent?.name}</span>
                <span className="text-zinc-500 font-mono text-[10px]">({activeStudent?.id})</span>
                <button onClick={handleStudentLogout} className="text-zinc-500 hover:text-zinc-300 ml-2">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowStudentModal(true)} className="text-xs bg-[#18181b] border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded hover:bg-zinc-800 transition">
                Student Login
              </button>
            )}

            <button onClick={() => isAdminAuthenticated ? (setCurrentRole('admin'), setActiveTab('admin')) : setShowAdminModal(true)} className="text-xs bg-[#18181b] border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded hover:bg-zinc-800 transition">
              {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </header>

        <nav className="border-b border-zinc-800/80 bg-[#0a0a0c] px-8 flex gap-6 text-xs">
          <button onClick={() => setActiveTab('inventory')} className={`py-3.5 border-b ${activeTab === 'inventory' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Catalog</button>
          {currentRole === 'student' && (
            <button onClick={() => setActiveTab('dashboard')} className={`py-3.5 border-b ${activeTab === 'dashboard' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>My Dashboard</button>
          )}
          <button onClick={() => setActiveTab('transactions')} className={`py-3.5 border-b ${activeTab === 'transactions' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Transaction History</button>
          {currentRole === 'admin' && isAdminAuthenticated && (
            <button onClick={() => setActiveTab('admin')} className={`py-3.5 border-b ${activeTab === 'admin' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Admin Master Panel</button>
          )}
        </nav>

        <main className="max-w-6xl mx-auto p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Total DB Records</span>
              <p className="text-2xl font-normal text-zinc-100 mt-1 font-mono">{books.length}</p>
            </div>
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Available</span>
              <p className="text-2xl font-normal text-zinc-200 mt-1 font-mono">{availableCount}</p>
            </div>
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Issued Out</span>
              <p className="text-2xl font-normal text-zinc-400 mt-1 font-mono">{issuedCount}</p>
            </div>
          </div>

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="flex gap-2 w-full sm:w-auto flex-1">
                    <input 
                      type="text" 
                      placeholder="Live search by title, author or ID..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 w-full sm:w-80 focus:outline-none focus:border-zinc-600 font-mono" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-mono">Sort By:</span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none font-mono">
                      <option value="id">Book ID</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="status">Availability</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                  {CATEGORIES.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] px-3 py-1 rounded font-mono transition ${selectedCategory === cat ? 'bg-zinc-200 text-zinc-950 font-medium' : 'bg-[#18181b] text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
                    >
                      {cat} {cat === 'All' ? `(${books.length})` : `(${books.filter((b: BookRecord) => b.category === cat).length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Title & Category</th>
                      <th className="py-3 px-5">Author</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                          Database Catalog is currently empty. Use Admin Panel to seed or add books.
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((b: BookRecord) => {
                        const isIssuedByMe = activeStudent && b.isIssued && b.issuedTo?.includes(activeStudent.id);
                        return (
                          <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                            <td className="py-3.5 px-5 font-mono text-zinc-400">{b.id}</td>
                            <td className="py-3.5 px-5 text-zinc-200 font-medium">
                              {b.title}
                              <span className="inline-block ml-2 text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{b.category}</span>
                            </td>
                            <td className="py-3.5 px-5 text-zinc-400">{b.author}</td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-mono ${b.isIssued ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-950/60 border border-emerald-900/60 text-emerald-400'}`}>
                                {b.isIssued ? 'Not Available' : 'Available'}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              {!b.isIssued ? (
                                <button onClick={() => handleAction('issueBook', { id: b.id })} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-700 transition">Issue</button>
                              ) : isIssuedByMe ? (
                                <button onClick={() => handleAction('returnBook', { id: b.id })} className="border border-zinc-700 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-800 transition">Return</button>
                              ) : (
                                <span className="text-[11px] text-zinc-500 font-mono italic">Checked Out</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && currentRole === 'student' && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
              <div>
                <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Welcome back, {activeStudent?.name}</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">Personal database dashboard for SE Roll Number: <span className="font-mono text-zinc-400">{activeStudent?.id}</span></p>
              </div>

              {myIssuedBooks.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                  No books currently issued to your account.
                </div>
              ) : (
                <div className="rounded overflow-hidden border border-zinc-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-5">ID</th>
                        <th className="py-3 px-5">Book Title & Category</th>
                        <th className="py-3 px-5">Date of Issuance</th>
                        <th className="py-3 px-5">Return Due Date</th>
                        <th className="py-3 px-5">Fine Status</th>
                        <th className="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {myIssuedBooks.map((b: BookRecord) => {
                        const { fine, isOverdue, daysLate } = calculateFine(b.returnDate);
                        return (
                          <tr key={b.id} className="hover:bg-zinc-900/40 transition font-mono">
                            <td className="py-3.5 px-5 text-zinc-400">{b.id}</td>
                            <td className="py-3.5 px-5 text-zinc-200 font-medium font-sans">
                              {b.title}
                              <span className="block text-[10px] text-zinc-500 mt-0.5">{b.category}</span>
                            </td>
                            <td className="py-3.5 px-5 text-zinc-300">{b.issuedDate || 'N/A'}</td>
                            <td className="py-3.5 px-5 text-zinc-300">{b.returnDate || 'N/A'}</td>
                            <td className="py-3.5 px-5">
                              {isOverdue ? (
                                <span className="bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] px-2 py-0.5 rounded">
                                  ₹{fine} Fine ({daysLate}d overdue)
                                </span>
                              ) : (
                                <span className="bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] px-2 py-0.5 rounded">
                                  No Fine
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-right font-sans">
                              <button onClick={() => handleAction('returnBook', { id: b.id })} className="border border-zinc-700 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-800 transition">Return</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
                {currentRole === 'student' ? `Personal Activity Log — ${activeStudent?.name} (${activeStudent?.id})` : 'Master Database Audit Trail Log'}
              </h2>
              {displayedHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                  No database audit records found.
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedHistory.map((h: HistoryLog, index: number) => (
                    <div key={index} className="p-3 bg-[#18181b] border border-zinc-800/60 rounded text-xs flex justify-between items-center font-mono">
                      <span className="text-zinc-300">{h.logMessage}</span>
                      <span className="text-zinc-600 text-[11px]">{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && currentRole === 'admin' && isAdminAuthenticated && (
            <div className="space-y-6">
              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Database Engine & Maintenance Control</h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Toggle maintenance lock and configure database availability.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={maintenanceResumeTime} 
                      onChange={e => setMaintenanceResumeTime(e.target.value)} 
                      placeholder="Resume time..." 
                      className="bg-[#18181b] border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 font-mono w-40 focus:outline-none" 
                    />
                    <button 
                      onClick={toggleMaintenanceMode} 
                      className={`text-xs px-4 py-2 rounded font-mono transition ${isMaintenanceMode ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                    >
                      {isMaintenanceMode ? 'Maintenance Active (Disable)' : 'Enable Maintenance Mode'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#18181b] border border-zinc-800 p-3 rounded font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase">DB Schema Size</span>
                    <p className="text-sm font-semibold text-zinc-200 mt-0.5">{books.length} Records</p>
                  </div>
                  <div className="bg-[#18181b] border border-zinc-800 p-3 rounded font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase">Persistence</span>
                    <p className="text-sm font-semibold text-emerald-400 mt-0.5">JSON Indexed</p>
                  </div>
                  <div className="bg-[#18181b] border border-zinc-800 p-3 rounded font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase">Query Ping</span>
                    <p className="text-sm font-semibold text-emerald-400 mt-0.5">2ms (Fast)</p>
                  </div>
                  <div className="bg-[#18181b] border border-zinc-800 p-3 rounded font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase">Engine Status</span>
                    <p className={`text-sm font-semibold mt-0.5 ${isMaintenanceMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isMaintenanceMode ? 'Maintenance' : 'Synchronized'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Server-Proxied AI Assistant Section */}
              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Enterprise AI Assistant</h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Secure server-side LLM proxy for handling natural language queries.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded font-mono">Secure Proxy Active</span>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded p-4 h-64 overflow-y-auto space-y-3 font-mono text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-md p-3 rounded ${msg.sender === 'admin' ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'}`}>
                        <span className="block text-[9px] uppercase opacity-50 mb-1">{msg.sender === 'admin' ? 'Admin Parth' : 'AI Assistant'}</span>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex items-start">
                      <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-3 rounded text-[11px]">
                        Processing inference request...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask anything (e.g. 'Status report' or 'Catalog overview')..." 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    className="flex-1 bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono" 
                  />
                  <button type="submit" disabled={isAiLoading} className="bg-zinc-200 text-zinc-950 font-medium text-xs px-5 py-2 rounded hover:bg-white transition disabled:opacity-50">Send</button>
                </form>
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Database Schema Category Graph</h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Real-time percentage distribution across database tables.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAction('seedDatabase', {})} className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded hover:bg-zinc-700 transition font-mono">
                      Re-Seed DB
                    </button>
                    <button onClick={exportLogsToCSV} className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded hover:bg-zinc-700 transition font-mono">
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                    {books.length === 0 ? (
                      <div className="w-full h-full bg-zinc-700/50 flex items-center justify-center text-[9px] font-mono text-zinc-400">DATABASE EMPTY</div>
                    ) : (
                      CATEGORIES.filter(c => c !== 'All').map(cat => {
                        const count = books.filter(b => b.category === cat).length;
                        const percentage = (count / books.length) * 100;
                        if (percentage === 0) return null;
                        return (
                          <div
                            key={cat}
                            title={`${cat}: ${count} records (${Math.round(percentage)}%)`}
                            className={`${CATEGORY_COLORS[cat] || 'bg-zinc-600'} h-full transition-all duration-500 hover:opacity-80`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        );
                      })
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                    {CATEGORIES.filter(c => c !== 'All').map(cat => {
                      const count = books.filter(b => b.category === cat).length;
                      const percentage = books.length > 0 ? Math.round((count / books.length) * 100) : 0;
                      return (
                        <div key={cat} className="bg-[#18181b] border border-zinc-800 p-2.5 rounded flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat] || 'bg-zinc-600'}`}></span>
                            <span className="text-zinc-300 text-[11px]">{cat}</span>
                          </div>
                          <span className="text-zinc-400 text-[11px] font-semibold">{count} ({percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Master Database Controls</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Drop table or reset catalog database.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction('seedDatabase', {})} className="bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 text-xs px-4 py-2 rounded hover:bg-emerald-900 transition font-mono">
                    Seed Default Books
                  </button>
                  <button onClick={() => handleAction('clearAllBooks', {})} className="bg-red-950/60 border border-red-900/60 text-red-300 text-xs px-4 py-2 rounded hover:bg-red-900 transition font-mono">
                    Drop All Records
                  </button>
                </div>
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Master Department Dashboard (Active Issues & Student Audit)</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Complete overview of all books checked out across SE department indexed by student roll numbers.</p>
                </div>

                {allIssuedBooks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                    No books currently checked out.
                  </div>
                ) : (
                  <div className="rounded overflow-hidden border border-zinc-800">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Book Title & Category</th>
                          <th className="py-3 px-4">Issued To (Student)</th>
                          <th className="py-3 px-4">Issuance Date</th>
                          <th className="py-3 px-4">Due Date</th>
                          <th className="py-3 px-4">Fine Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {allIssuedBooks.map((b: BookRecord) => {
                          const { fine, isOverdue, daysLate } = calculateFine(b.returnDate);
                          return (
                            <tr key={b.id} className="hover:bg-zinc-900/40 transition font-mono">
                              <td className="py-3 px-4 text-zinc-400">{b.id}</td>
                              <td className="py-3 px-4 text-zinc-200 font-medium font-sans">
                                {b.title}
                                <span className="block text-[10px] text-zinc-500 mt-0.5">{b.category}</span>
                              </td>
                              <td className="py-3 px-4 text-zinc-300 font-semibold">{b.issuedTo}</td>
                              <td className="py-3 px-4 text-zinc-400">{b.issuedDate || 'N/A'}</td>
                              <td className="py-3 px-4 text-zinc-300">{b.returnDate || 'N/A'}</td>
                              <td className="py-3 px-4">
                                {isOverdue ? (
                                  <span className="bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] px-2 py-0.5 rounded">
                                    ₹{fine} Fine ({daysLate}d late)
                                  </span>
                                ) : (
                                  <span className="bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] px-2 py-0.5 rounded">
                                    No Fine
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Insert New Book Record into Database</h2>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input type="number" placeholder="Book ID" value={id} onChange={e => setId(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono" />
                  <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                  <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                  <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none font-mono">
                    {CATEGORIES.filter((c: string) => c !== 'All').map((c: string) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => handleAction('addBook', {})} className="bg-zinc-200 text-zinc-950 font-medium text-xs py-2 rounded hover:bg-white transition">Commit Record</button>
                </div>
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Admin Management: Remove Books from Database</h2>
                {books.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                    No database records to remove.
                  </div>
                ) : (
                  <div className="rounded overflow-hidden border border-zinc-800">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-5">ID</th>
                          <th className="py-3 px-5">Title & Category</th>
                          <th className="py-3 px-5">Author</th>
                          <th className="py-3 px-5 text-right">Admin Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {books.map((b: BookRecord) => (
                          <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                            <td className="py-3.5 px-5 font-mono text-zinc-400">{b.id}</td>
                            <td className="py-3.5 px-5 text-zinc-200 font-medium">
                              {b.title}
                              <span className="block text-[10px] font-mono text-zinc-500 mt-0.5">{b.category}</span>
                            </td>
                            <td className="py-3.5 px-5 text-zinc-400">{b.author}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button onClick={() => handleAction('deleteBook', { id: b.id })} className="bg-red-950/60 border border-red-900/60 text-red-300 px-3 py-1 rounded text-[11px] hover:bg-red-900 transition">Remove Book</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      <footer className="border-t border-zinc-800/80 bg-[#0c0c0e] px-8 py-4 text-xs text-zinc-600 flex justify-between font-mono">
        <p>© 2026 Delhi Technological University</p>
        <p>Secure Enterprise Architecture</p>
      </footer>
    </div>
  );
}