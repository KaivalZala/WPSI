import React, { useState, useEffect, useRef } from 'react';

const SYLLABUS = [
  { day: 1, tech: { name: 'Electronics Components', target: 460 }, math: { name: 'Maths base, Square & Cube root', target: 450 }, reason: { name: 'Calendar, Clock', target: 300 } },
  { day: 2, tech: { name: 'Digital Electronics & VLSI', target: 700 }, math: { name: 'Sankhaio, Ghat/Ghataank, LCM/HCF', target: 450 }, reason: { name: 'Distance, Seating', target: 300 } },
  { day: 3, tech: { name: 'Electronics Networks & Instruments', target: 490 }, math: { name: 'Samntar sareni, Kam, Nad/taki', target: 450 }, reason: { name: 'Series, Alphabet series', target: 300 } },
  { day: 4, tech: { name: 'Communication Engineering', target: 1090 }, math: { name: 'Sareras, Madyak, Takavari', target: 450 }, reason: { name: 'Coding decoding, Sam sabandha', target: 300 } },
  { day: 5, tech: { name: 'Communication Applications', target: 1040 }, math: { name: 'Sadu vayaj, Nafo/khot, Train', target: 450 }, reason: { name: 'Blood relation, Missing number', target: 300 } },
  { day: 6, tech: { name: 'Microprocessors', target: 400 }, math: { name: 'Gunotar, Hodi, Bhagidari', target: 450 }, reason: { name: 'Diagram, Alphabet arrangement', target: 300 } },
  { day: 7, tech: { name: 'Computer Networks', target: 500 }, math: { name: 'Chakar varuti vayaj, Jadap', target: 300 }, reason: { name: 'Dice, Bodmas', target: 300 } },
  { day: 8, tech: { name: 'Network Security', target: 360 }, math: { name: 'Mahiti, Surekh samikarn', target: 300 }, reason: { name: 'Shape counting', target: 150 } },
  { day: 9, tech: { name: 'Web Technology', target: 790 }, math: { name: 'Divgat samekran, Parimeti', target: 300 }, reason: { name: 'Ukhanavo', target: 150 } },
  { day: 10, tech: { name: 'Android Dev', target: 610 }, math: { name: 'Ghan, Kramcha', target: 300 }, reason: { name: 'Review Day (Mistakes)', target: 150 } },
  { day: 11, tech: { name: 'Current Trends', target: 560 }, math: { name: 'Bijganit, Sambhavna', target: 300 }, reason: { name: 'Full Mock Test', target: 150 } }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDay, setCurrentDay] = useState(() => parseInt(localStorage.getItem('currentDay') || '1'));
  
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('dailyProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  const [newMistakeSubject, setNewMistakeSubject] = useState('Technical');
  const [newMistakePriority, setNewMistakePriority] = useState('High');
  const [newMistakeTags, setNewMistakeTags] = useState('');
  const [newMistakeText, setNewMistakeText] = useState('');
  
  const [mistakeFilter, setMistakeFilter] = useState('All');
  const [mistakeStatusFilter, setMistakeStatusFilter] = useState('Active');

  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus');
  const [focusBlocksCompleted, setFocusBlocksCompleted] = useState(() => parseInt(localStorage.getItem('focusBlocksCompleted') || '0'));

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('currentDay', currentDay.toString());
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
    localStorage.setItem('mistakes', JSON.stringify(mistakes));
    localStorage.setItem('focusBlocksCompleted', focusBlocksCompleted.toString());
  }, [currentDay, dailyProgress, mistakes, focusBlocksCompleted]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerMode === 'focus') {
              setFocusBlocksCompleted(c => c + 1);
              setTimerMode('break');
              return 10 * 60;
            } else {
              setTimerMode('focus');
              return 50 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  const currentCycle = Math.ceil(currentDay / 11);
  const cycleDay = ((currentDay - 1) % 11) + 1;
  const todaySyllabus = SYLLABUS.find(s => s.day === cycleDay);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerMode === 'focus' ? 50 * 60 : 10 * 60);
  };

  const switchTimerMode = (mode) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimeLeft(mode === 'focus' ? 50 * 60 : 10 * 60);
  };

  const handleProgressChange = (subject, value) => {
    setDailyProgress(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [subject]: parseInt(value) || 0
      }
    }));
  };

  const getProgress = (subject) => {
    return dailyProgress[currentDay]?.[subject] || 0;
  };

  const calculateTotalMCQs = () => {
    let total = 0;
    Object.values(dailyProgress).forEach((day) => {
      const d = day as any;
      total += (d.tech || 0) + (d.math || 0) + (d.reason || 0);
    });
    return total;
  };

  const calculateDailyCompletionPercentage = () => {
    if (!todaySyllabus) return 0;
    const techDone = Math.min(getProgress('tech') / todaySyllabus.tech.target, 1) || 0;
    const mathDone = Math.min(getProgress('math') / todaySyllabus.math.target, 1) || 0;
    const reasonDone = Math.min(getProgress('reason') / todaySyllabus.reason.target, 1) || 0;
    return Math.round(((techDone + mathDone + reasonDone) / 3) * 100);
  };

  const addMistake = (e) => {
    e.preventDefault();
    if (!newMistakeText.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      subject: newMistakeSubject,
      priority: newMistakePriority,
      tags: newMistakeTags,
      text: newMistakeText,
      day: currentDay,
      cycle: currentCycle,
      date: new Date().toLocaleDateString(),
      status: 'Active'
    };

    setMistakes(prev => [newEntry, ...prev]);
    setNewMistakeText('');
    setNewMistakeTags('');
  };

  const toggleMistakeStatus = (id) => {
    setMistakes(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'Active' ? 'Resolved' : 'Active' };
      }
      return m;
    }));
  };

  const deleteMistake = (id) => {
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ mistakes, dailyProgress, currentDay, focusBlocksCompleted }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `Revision_Backup_Day${currentDay}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.currentDay) setCurrentDay(parseInt(data.currentDay));
        if (data.dailyProgress) setDailyProgress(data.dailyProgress);
        if (data.mistakes) setMistakes(data.mistakes);
        if (data.focusBlocksCompleted !== undefined) setFocusBlocksCompleted(parseInt(data.focusBlocksCompleted));
        alert("✅ Data successfully restored from backup!");
      } catch (error) {
        alert("❌ Error loading backup file.");
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const timeTravelMistakes = mistakes.filter(m => 
    m.status === 'Active' && 
    ((m.day - 1) % 11) + 1 === cycleDay && 
    m.cycle < currentCycle
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-2 sm:p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        <header className="flex flex-col lg:flex-row justify-between items-center bg-slate-800 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-700 gap-4">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Mission 170 Marks</h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">33-Day Heavy Revision Protocol</p>
          </div>

          <div className="flex flex-row items-center gap-4 bg-slate-900 px-6 py-3 rounded-xl border border-slate-700 w-full lg:w-auto justify-center shrink-0">
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold">Total MCQs</p>
              <p className="text-lg md:text-xl font-bold text-blue-400">{calculateTotalMCQs()}</p>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold">Overall Progress</p>
              <p className="text-lg md:text-xl font-bold text-emerald-400">{Math.round((currentDay / 33) * 100)}%</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 w-full lg:w-auto overflow-x-auto shrink-0">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('mistakes')} className={`px-4 py-2 rounded-md ${activeTab === 'mistakes' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>Logbook ({mistakes.filter(m => m.status === 'Active').length})</button>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-md text-emerald-400">Import</button>
            <button onClick={exportData} className="px-4 py-2 rounded-md text-blue-400">Export</button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-2xl border border-blue-900/50">
                <h2 className="text-sm text-slate-400 font-bold uppercase mb-4">Current Position</h2>
                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                  <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="p-3 bg-slate-700 rounded-lg">←</button>
                  <span className="text-3xl font-black">Day {currentDay}</span>
                  <button onClick={() => setCurrentDay(Math.min(33, currentDay + 1))} className="p-3 bg-slate-700 rounded-lg">→</button>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h2 className="text-sm text-slate-400 font-bold uppercase mb-4">Focus Timer</h2>
                <div className="flex items-center justify-between">
                  <span className={`text-4xl font-mono font-bold ${timerMode === 'focus' ? 'text-blue-400' : 'text-emerald-400'}`}>{formatTime(timeLeft)}</span>
                  <div className="flex gap-2">
                    <button onClick={toggleTimer} className="p-3 bg-slate-700 rounded-lg">{isTimerRunning ? 'Pause' : 'Start'}</button>
                    <button onClick={resetTimer} className="p-3 bg-slate-900 rounded-lg">Reset</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Technical', sub: todaySyllabus?.tech, key: 'tech', color: 'blue' },
                { label: 'Reasoning', sub: todaySyllabus?.reason, key: 'reason', color: 'amber' },
                { label: 'Maths', sub: todaySyllabus?.math, key: 'math', color: 'emerald' }
              ].map(s => (
                <div key={s.label} className={`bg-slate-800 p-6 rounded-2xl border-t-4 border-${s.color}-500`}>
                  <h3 className="font-bold mb-2">{s.label}</h3>
                  <p className="text-slate-400 text-sm mb-4">{s.sub?.name}</p>
                  <input type="number" value={getProgress(s.key) || ''} onChange={(e) => handleProgressChange(s.key, e.target.value)} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-center" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="bg-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Logbook</h2>
            <form onSubmit={addMistake} className="flex gap-2 mb-6">
              <input value={newMistakeText} onChange={(e) => setNewMistakeText(e.target.value)} className="flex-1 bg-slate-900 p-3 rounded" placeholder="What went wrong?" />
              <button type="submit" className="bg-red-600 px-6 py-3 rounded">Save</button>
            </form>
            <div className="space-y-2">
              {mistakes.map(m => (
                <div key={m.id} className="p-4 bg-slate-900 rounded flex justify-between">
                  <span>{m.text}</span>
                  <button onClick={() => deleteMistake(m.id)} className="text-red-400">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}