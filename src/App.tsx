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
  // Load initial state from local storage if available, otherwise use defaults
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDay, setCurrentDay] = useState(() => parseInt(localStorage.getItem('currentDay')) || 1);
  
  // MCQ Tracking State
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('dailyProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Mistake Book State
  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  // Form States
  const [newMistakeSubject, setNewMistakeSubject] = useState('Technical');
  const [newMistakePriority, setNewMistakePriority] = useState('High');
  const [newMistakeTags, setNewMistakeTags] = useState('');
  const [newMistakeText, setNewMistakeText] = useState('');
  
  // Filters
  const [mistakeFilter, setMistakeFilter] = useState('All');
  const [mistakeStatusFilter, setMistakeStatusFilter] = useState('Active');

  // Pomodoro Timer State
  // Pomodoro Timer State

const [timerMode, setTimerMode] = useState(() => {
  return localStorage.getItem('timerMode') || 'focus';
});

const [timeLeft, setTimeLeft] = useState(() => {
  const saved = localStorage.getItem('timeLeft');
  return saved ? parseInt(saved) : 50 * 60;
});

const [isTimerRunning, setIsTimerRunning] = useState(() => {
  return localStorage.getItem('isTimerRunning') === 'true';
});

const [timerEndTime, setTimerEndTime] = useState(() => {
  const saved = localStorage.getItem('timerEndTime');
  return saved ? parseInt(saved) : null;
});

const [focusBlocksCompleted, setFocusBlocksCompleted] = useState(() =>
  parseInt(localStorage.getItem('focusBlocksCompleted')) || 0
);
  // File Input Ref for Importing
  const fileInputRef = useRef(null);
  // Notification permission
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []);

  // Save to local storage whenever important state changes
  useEffect(() => {
    localStorage.setItem('currentDay', String(currentDay));
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
    localStorage.setItem('mistakes', JSON.stringify(mistakes));
    localStorage.setItem('focusBlocksCompleted',String(focusBlocksCompleted));
  }, [currentDay, dailyProgress, mistakes, focusBlocksCompleted]);

  // Save timer data
useEffect(() => {
  localStorage.setItem('timeLeft', String(timeLeft));
  localStorage.setItem('isTimerRunning', String(isTimerRunning));
  localStorage.setItem('timerMode', timerMode);

  if (timerEndTime) {
    localStorage.setItem(
      'timerEndTime',
      String(timerEndTime)
    );
  }
}, [
  timeLeft,
  isTimerRunning,
  timerMode,
  timerEndTime
]);

  // Timer countdown logic
 // Timer countdown logic
useEffect(() => {
  let interval = null;

  if (isTimerRunning && timerEndTime) {
    interval = setInterval(() => {

      const now = Date.now();

      const remaining = Math.max(
        0,
        Math.floor((timerEndTime - now) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {

        clearInterval(interval);

        setIsTimerRunning(false);

        // SOUND
const audio = new Audio('/alarm.mp3');

audio.loop = true;

audio.play();

setTimeout(() => {
  audio.pause();
  audio.currentTime = 0;
}, 9000);

        // NOTIFICATION
        if (Notification.permission === "granted") {

          new Notification(
            timerMode === 'focus'
              ? 'Focus Session Complete!'
              : 'Break Time Over!',
            {
              body:
                timerMode === 'focus'
                  ? 'Take a break now.'
                  : 'Start studying again.',
            }
          );
        }

        // AUTO SWITCH
        if (timerMode === 'focus') {

          setFocusBlocksCompleted(c => c + 1);

          setTimerMode('break');

          setTimeLeft(10 * 60);

        } else {

          setTimerMode('focus');

          setTimeLeft(50 * 60);
        }

        localStorage.removeItem('timerEndTime');
      }

    }, 1000);
  }

  return () => clearInterval(interval);

}, [
  isTimerRunning,
  timerEndTime,
  timerMode
]);
  const currentCycle = Math.ceil(currentDay / 11);
  const cycleDay = ((currentDay - 1) % 11) + 1;
  const todaySyllabus = SYLLABUS.find(s => s.day === cycleDay);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

const toggleTimer = () => {

  if (!isTimerRunning) {

    const endTime =
      Date.now() + timeLeft * 1000;

    setTimerEndTime(endTime);

  } else {

    localStorage.removeItem('timerEndTime');
  }

  setIsTimerRunning(!isTimerRunning);
};  

  const resetTimer = () => {

  setIsTimerRunning(false);

  localStorage.removeItem(
    'timerEndTime'
  );

  setTimeLeft(
    timerMode === 'focus'
      ? 50 * 60
      : 10 * 60
  );
};

const switchTimerMode = (mode) => {

  setIsTimerRunning(false);

  localStorage.removeItem(
    'timerEndTime'
  );

  setTimerMode(mode);

  setTimeLeft(
    mode === 'focus'
      ? 50 * 60
      : 10 * 60
  );
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
Object.values(dailyProgress as any).forEach((day: any) => {
  total +=
    (day.tech || 0) +
    (day.math || 0) +
    (day.reason || 0);
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
    const file = event.target.files[0];
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
        alert("❌ Error loading backup file. Please make sure it's the correct JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null; // Reset input
  };

  const timeTravelMistakes = mistakes.filter(m => 
    m.status === 'Active' && 
    ((m.day - 1) % 11) + 1 === cycleDay && 
    m.cycle < currentCycle
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-2 sm:p-4 md:p-8">
      {/* Hide scrollbar completely but allow scroll for smooth mobile experience */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header & Navigation */}
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

          {/* FIX: Navigation Buttons - Perfect Single Row, No Wrapping */}
          <div className="flex flex-row items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 w-full lg:w-auto overflow-x-auto hide-scrollbar flex-nowrap shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`shrink-0 px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('mistakes')}
              className={`shrink-0 px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${activeTab === 'mistakes' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Logbook ({mistakes.filter(m => m.status === 'Active').length})
            </button>
            
            {/* Visual Divider */}
            <div className="w-px h-6 bg-slate-700 shrink-0 mx-1"></div>
            
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="shrink-0 px-4 py-2 rounded-md transition-all text-slate-400 hover:text-emerald-400 hover:bg-slate-800 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Import
            </button>

            <button 
              onClick={exportData}
              className="shrink-0 px-4 py-2 rounded-md transition-all text-slate-400 hover:text-blue-400 hover:bg-slate-800 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export
            </button>
          </div>
        </header>

        {}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 md:space-y-6">
            
            {/* Top Row: Current Position & Timer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* Current Day Control */}
              <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border border-blue-900/50 shadow-xl relative overflow-hidden group">
                {/* FIX: Added pointer-events-none to prevent the overlay from blocking clicks */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                {/* FIX: Added relative z-10 to bring elements above the background layer */}
                <div className="relative z-10 flex justify-between items-center mb-4">
                  <h2 className="text-sm text-slate-400 font-bold uppercase tracking-wider">Current Position</h2>
                  <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-700">
                    Cycle {currentCycle} of 3
                  </span>
                </div>
                
                <div className="relative z-10 flex items-center justify-between bg-slate-900/50 rounded-xl p-2 border border-slate-700/50">
                  <button 
                    onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                    disabled={currentDay === 1}
                    className={`p-3 rounded-lg transition-colors ${currentDay === 1 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-500 text-white shadow-md'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <div className="text-center">
                    <span className="text-3xl md:text-4xl font-black text-white">Day {currentDay}</span>
                  </div>
                  <button 
                    onClick={() => setCurrentDay(Math.min(33, currentDay + 1))}
                    disabled={currentDay === 33}
                    className={`p-3 rounded-lg transition-colors ${currentDay === 33 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-500 text-white shadow-md'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                
                {/* Daily Progress Bar */}
                <div className="relative z-10 mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Daily Target Completion</span>
                    <span className="text-emerald-400 font-bold">{calculateDailyCompletionPercentage()}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: `${calculateDailyCompletionPercentage()}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Pomodoro Timer */}
              <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm text-slate-400 font-bold uppercase tracking-wider">Focus Timer</h2>
                  <div className="flex bg-slate-900 rounded-lg p-1">
                    <button 
                      onClick={() => switchTimerMode('focus')}
                      className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${timerMode === 'focus' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      50m Focus
                    </button>
                    <button 
                      onClick={() => switchTimerMode('break')}
                      className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${timerMode === 'break' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                    >
                      10m Break
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`text-5xl font-black font-mono tracking-tighter ${timerMode === 'focus' ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleTimer}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-lg ${isTimerRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                      {isTimerRunning ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    <button 
                      onClick={resetTimer}
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400 font-medium bg-slate-900/50 p-2 rounded-lg border border-slate-700 inline-block">
                  🎯 <span className="text-white font-bold">{focusBlocksCompleted}</span> Focus Blocks Completed Today
                </div>
              </div>
            </div>

            {/* Warning Banner for Cycle 2 & 3 */}
            {timeTravelMistakes.length > 0 && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-red-400 font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Time-Travel Review Required
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">You made {timeTravelMistakes.length} mistake(s) on these exact chapters during your previous revision. Read your Logbook before starting!</p>
                </div>
                <button 
                  onClick={() => setActiveTab('mistakes')}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors w-full sm:w-auto"
                >
                  View Logbook
                </button>
              </div>
            )}

            {/* Subject Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              {/* Technical Block */}
              <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border-t-4 border-slate-800 border-t-blue-500 shadow-xl flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">07:00 AM - 12:00 PM</span>
                    <h3 className="text-xl font-bold text-white mt-1">Technical</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-lg mb-6 flex-1 font-medium">{todaySyllabus?.tech.name}</p>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Target</span>
                    <span className="font-bold text-blue-400">{todaySyllabus?.tech.target} MCQs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="Done"
                      value={getProgress('tech') || ''}
                      onChange={(e) => handleProgressChange('tech', e.target.value)}
                      className="bg-slate-800 border border-slate-600 text-white rounded-lg p-3 w-24 text-center font-bold focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex-1 bg-slate-800 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((getProgress('tech') / (todaySyllabus?.tech.target || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning Block */}
              <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border-t-4 border-slate-800 border-t-amber-500 shadow-xl flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">02:00 PM - 04:00 PM</span>
                    <h3 className="text-xl font-bold text-white mt-1">Reasoning</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-lg mb-6 flex-1 font-medium">{todaySyllabus?.reason.name}</p>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Target</span>
                    <span className="font-bold text-amber-500">{todaySyllabus?.reason.target} MCQs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="Done"
                      value={getProgress('reason') || ''}
                      onChange={(e) => handleProgressChange('reason', e.target.value)}
                      className="bg-slate-800 border border-slate-600 text-white rounded-lg p-3 w-24 text-center font-bold focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex-1 bg-slate-800 rounded-full h-3">
                      <div 
                        className="bg-amber-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((getProgress('reason') / (todaySyllabus?.reason.target || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maths Block */}
              <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border-t-4 border-slate-800 border-t-emerald-500 shadow-xl flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">04:00 PM - 07:00 PM</span>
                    <h3 className="text-xl font-bold text-white mt-1">Maths</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-lg mb-6 flex-1 font-medium">{todaySyllabus?.math.name}</p>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Target</span>
                    <span className="font-bold text-emerald-500">{todaySyllabus?.math.target} MCQs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="Done"
                      value={getProgress('math') || ''}
                      onChange={(e) => handleProgressChange('math', e.target.value)}
                      className="bg-slate-800 border border-slate-600 text-white rounded-lg p-3 w-24 text-center font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex-1 bg-slate-800 rounded-full h-3">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((getProgress('math') / (todaySyllabus?.math.target || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {}
        {activeTab === 'mistakes' && (
          <div className="space-y-4 md:space-y-6">
            
            {/* Input Form */}
            <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border border-red-900/50 shadow-xl">
              <h2 className="text-xl font-bold text-red-400 mb-2">Log a Weakness / Mistake</h2>
              <p className="text-sm text-slate-400 mb-4">Write down formulas or concepts you forgot today. You will review this during your 8:00 PM session.</p>
              
              <form onSubmit={addMistake} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <select 
                    value={newMistakeSubject}
                    onChange={(e) => setNewMistakeSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 w-full"
                  >
                    <option>Technical</option>
                    <option>Maths</option>
                    <option>Reasoning</option>
                  </select>
                  <select 
                    value={newMistakePriority}
                    onChange={(e) => setNewMistakePriority(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 w-full"
                  >
                    <option value="High">🔴 Critical</option>
                    <option value="Medium">🟠 Medium</option>
                    <option value="Low">🔵 Silly Error</option>
                  </select>
                  <input 
                    type="text"
                    value={newMistakeTags}
                    onChange={(e) => setNewMistakeTags(e.target.value)}
                    placeholder="#Tags (e.g., formula) - Optional"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 w-full sm:col-span-2 md:col-span-1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={newMistakeText}
                    onChange={(e) => setNewMistakeText(e.target.value)}
                    placeholder="E.g., Forgot the formula for Chakar varuti vayaj..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 w-full"
                    required
                  />
                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-lg font-bold transition-colors shadow-lg whitespace-nowrap w-full sm:w-auto">
                    Save Note
                  </button>
                </div>
              </form>
            </div>

            {/* List of Mistakes */}
            <div className="bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h3 className="text-lg font-bold flex flex-wrap items-center gap-2">
                  Your Logbook
                  <span className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-400 font-normal whitespace-nowrap">
                    Read these during Revisions 2 & 3
                  </span>
                </h3>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                    <button
                      onClick={() => setMistakeStatusFilter('Active')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${mistakeStatusFilter === 'Active' ? 'bg-red-900/50 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Active Needs Review
                    </button>
                    <button
                      onClick={() => setMistakeStatusFilter('Resolved')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${mistakeStatusFilter === 'Resolved' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Resolved Vault
                    </button>
                  </div>

                  <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                    {['All', 'Technical', 'Maths', 'Reasoning'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setMistakeFilter(filter)}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${mistakeFilter === filter ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {mistakes.filter(m => (mistakeFilter === 'All' || m.subject === mistakeFilter) && (m.status || 'Active') === mistakeStatusFilter).length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-xl">
                  <p className="text-slate-500">No {mistakeStatusFilter.toLowerCase()} mistakes found for this filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mistakes.filter(m => (mistakeFilter === 'All' || m.subject === mistakeFilter) && (m.status || 'Active') === mistakeStatusFilter).map(mistake => (
                    <div key={mistake.id} className={`flex flex-col md:flex-row md:items-start justify-between p-4 rounded-xl border gap-4 transition-all ${mistakeStatusFilter === 'Resolved' ? 'bg-slate-900/30 border-slate-800 opacity-75' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}>
                      <div className="flex items-start gap-3 md:gap-4 flex-1 flex-col sm:flex-row w-full">
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          <span className={`flex-1 sm:flex-none px-2 py-1 rounded text-xs font-bold text-center whitespace-nowrap ${
                            mistake.subject === 'Technical' ? 'bg-blue-900/50 text-blue-400' :
                            mistake.subject === 'Maths' ? 'bg-emerald-900/50 text-emerald-400' :
                            'bg-amber-900/50 text-amber-400'
                          }`}>
                            {mistake.subject}
                          </span>
                          <span className={`flex-1 sm:flex-none px-2 py-1 rounded text-xs font-bold text-center whitespace-nowrap ${
                            mistake.priority === 'High' ? 'bg-red-900/30 text-red-400' :
                            mistake.priority === 'Medium' ? 'bg-orange-900/30 text-orange-400' :
                            'bg-blue-900/30 text-blue-400'
                          }`}>
                            {mistake.priority === 'High' ? 'Critical' : mistake.priority === 'Medium' ? 'Medium' : 'Silly Error'}
                          </span>
                        </div>
                        
                        <div className="flex-1 w-full">
                          <p className={`text-base md:text-lg break-words ${mistakeStatusFilter === 'Resolved' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {mistake.text}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500 font-medium">Day {mistake.day} (Cycle {mistake.cycle}) • {mistake.date}</span>
                            {mistake.tags && (
                              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                                {mistake.tags}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-2 min-w-[140px] w-full md:w-auto justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-800 md:border-t-0">
                        {mistakeStatusFilter === 'Active' ? (
                          <button 
                            onClick={() => toggleMistakeStatus(mistake.id)}
                            className="flex-1 md:flex-none text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/30 px-3 py-3 md:py-2 rounded-lg text-sm font-medium transition-all border border-transparent hover:border-emerald-500/30 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Mark Understood
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleMistakeStatus(mistake.id)}
                            className="flex-1 md:flex-none text-slate-500 hover:text-amber-400 hover:bg-amber-900/30 px-3 py-3 md:py-2 rounded-lg text-sm font-medium transition-all border border-transparent hover:border-amber-500/30 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                            Re-activate
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMistake(mistake.id)}
                          className="flex-1 md:flex-none text-slate-500 hover:text-red-400 hover:bg-red-900/30 px-3 py-3 md:py-2 rounded-lg text-sm font-medium transition-all border border-transparent hover:border-red-500/30 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
