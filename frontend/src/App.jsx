import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [bpmData, setBpmData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [currentBpm, setCurrentBpm] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null); // 🆕
  const [started, setStarted] = useState(false);

  const getStressLevel = (bpm) => {
    if (bpm === null) return { text: 'Loading...', emoji: '⏳', color: '#a4865f' };
    if (bpm < 70) return { text: 'Chill', emoji: '😌', color: '#a4865f' };
    if (bpm >= 70 && bpm <= 90) return { text: 'Shit..', emoji: '😰', color: '#a4865f' };
    if (bpm > 90) return { text: 'AYOOOOO', emoji: '😱', color: '#a4865f' };
    return { text: 'Unknown', emoji: '❓', color: '#a4865f' };
  };

  const stress = getStressLevel(currentBpm);

  useEffect(() => {
    if (!started) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const eventSource = new EventSource(`${backendUrl}/api/stream_bpm`);


    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const now = new Date();
      
      setCurrentBpm(data.bpm);
      setBpmData(prev => [...prev.slice(-19), data.bpm]);
      setTimestamps(prev => [...prev.slice(-19), now.toLocaleTimeString()]);
      setLastUpdated(now.toLocaleTimeString()); // 🆕 update timestamp
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [started]);

  // play background musicstart music
  useEffect(() => {
    if (!started) return;

    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
      audio.volume = 0;
      audio.play().then(() => {
        let volume = 0;
        const fadeInterval = setInterval(() => {
          if (volume < 1) {
            volume += 0.02;
            audio.volume = Math.min(volume, 1);
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }).catch((err) => {
        console.error('Failed to play background music:', err);
      });
    }
  }, [started]);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: bpmData,
        fill: false,
        borderColor: stress.color,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 50,
        max: 150,
      },
    },
  };

return (
  <div
    style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: 'url("/defaultbackground.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* 🎵 Hidden Audio */}
    <audio id="bg-music" loop src="/North-London-Forever.mp3" style={{ display: 'none' }} />

    {/* 🛡️ Badges */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 3rem', // ← more padding around badges
      transform: 'translateY(-50%)',
      zIndex: 2,
    }}>
      {/* <img src="/madrid.png" alt="Real Madrid" style={{ height: '12vh', margin: '1rem' }} />
      <img src="/arsenal.png" alt="Arsenal" style={{ height: '10vh', margin: '1rem' }} /> */}
      <img 
        src="/madrid.png" 
        alt="Real Madrid" 
        style={{ 
          width: '10vw', 
          minWidth: '50px', 
          height: 'auto',    // ✅ Important to make it proportional
          margin: '1rem',
          objectFit: 'contain',
        }} 
      />
      <img 
        src="/arsenal.png" 
        alt="Arsenal" 
        style={{ 
          width: '12vw', 
          minWidth: '50px', 
          height: 'auto',    // ✅ Important to make it proportional
          margin: '1rem',
          objectFit: 'contain',
        }} 
      />
    </div>

    {/* Center Card */}
    <div
      style={{
        width: '75%',
        margin: 'auto',
        marginTop: '8vh',
        padding: '2rem',
        borderRadius: '20px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {!started ? (
          <button
            onClick={() => setStarted(true)}
            className='start-button'
            style={{
              fontSize: '1.5rem',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'rgb(157 102 60 / 85%)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Lever karen?
          </button>
        ) : (
          <>
            {currentBpm !== null && (
              <>
                <div style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
                  {stress.text} {stress.emoji}
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
                  ❤️ {currentBpm} BPM
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 🔥 Updated "last updated" moved to bottom-right */}
      {lastUpdated && (
        <div style={{
          fontSize: '1rem',
          fontWeight: 'normal',
          opacity: 0.8,
          textAlign: 'right',
          marginTop: '1rem',
        }}>
          Updated at: {lastUpdated}
        </div>
      )}
    </div>
  </div>
);


}

export default App;

