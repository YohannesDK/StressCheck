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
  const [started, setStarted] = useState(false);

  const getStressLevel = (bpm) => {
    if (bpm === null) return { text: 'Loading...', emoji: '⏳', color: '#a4865f' };
    if (bpm < 80) return { text: 'Chill', emoji: '😌', color: '#a4865f' };
    if (bpm >= 80 && bpm <= 100) return { text: 'Shit..', emoji: '😰', color: '#a4865f' };
    if (bpm > 100) return { text: 'AYOOOOO', emoji: '😱', color: '#a4865f' };
    return { text: 'Unknown', emoji: '❓', color: '#a4865f' };
  };

  const stress = getStressLevel(currentBpm);

  useEffect(() => {
    if (!started) return;

    const eventSource = new EventSource('/api/stream_bpm');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const now = new Date().toLocaleTimeString();
      
      setCurrentBpm(data.bpm);
      setBpmData(prev => [...prev.slice(-19), data.bpm]);
      setTimestamps(prev => [...prev.slice(-19), now]);
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
        width: '75%',
        margin: 'auto',
        minHeight: '70vh',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundImage: 'url("/defaultbackground.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Blurred overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          zIndex: 0,
        }}
      />


      {/* Main Content */}
      <div style={{ maxWidth: '80%', margin: 'auto', textAlign: 'center', color: 'white', zIndex: 1, position: 'relative' }}>
        {/* 🎵 Hidden Audio */}
        <audio id="bg-music" loop src="/North-London-Forever.mp3" style={{ display: 'none' }} />

        {/* 🛡️ Badges + Center Content */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', marginBottom: '2rem' }}>
          <img src="/madrid.png" alt="Real Madrid" style={{ height: '11vh' }} />

          {/* Middle part: Button or Stress Info */}
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
                    <div style={{ minWidth: '10rem', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
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

          <img src="/arsenal.png" alt="Arsenal" style={{ height: '9vh' }} />
        </div>

        {/* 📈 Graph */}
        {started && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'fit-content', padding: '1rem' }}>
            <div style={{ width: '80%', backgroundColor: '#563d2759', borderRadius: '16px', padding: '1rem' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

