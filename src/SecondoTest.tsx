/**
 * SECONDO TEST
 * Pagina separata per test indipendenti - Test Lottie Animations
 */

import { useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import exampleAnimation from './animations/flamingos.json';

function SecondoTest() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  // Controlli per l'animazione
  const handlePlayPause = () => {
    if (isPlaying) {
      lottieRef.current?.pause();
    } else {
      lottieRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    lottieRef.current?.stop();
    setIsPlaying(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    lottieRef.current?.setSpeed(newSpeed);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎨 Test Lottie Animations</h1>
        <p style={styles.subtitle}>Pagina di test per animazioni Lottie JSON</p>
      </div>

      <div style={styles.content}>
        {/* Card animazione Lottie */}
        <div style={styles.card}>
          <h2>Animazione Lottie</h2>
          <p style={styles.description}>
            Questa è un'animazione JSON renderizzata con Lottie React
          </p>

          {/* Area animazione */}
          <div style={styles.animationContainer}>
            <Lottie
              lottieRef={lottieRef}
              animationData={exampleAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 300, height: 300 }}
            />
          </div>

          {/* Controlli */}
          <div style={styles.controls}>
            <h3 style={styles.controlsTitle}>Controlli Animazione</h3>
            
            <div style={styles.buttonGroup}>
              <button onClick={handlePlayPause} style={styles.controlButton}>
                {isPlaying ? '⏸ Pausa' : '▶ Play'}
              </button>
              <button onClick={handleStop} style={styles.controlButton}>
                ⏹ Stop
              </button>
            </div>

            <div style={styles.speedControl}>
              <label style={styles.label}>Velocità: {speed}x</label>
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => handleSpeedChange(0.5)} 
                  style={speed === 0.5 ? styles.activeSpeedButton : styles.speedButton}
                >
                  0.5x
                </button>
                <button 
                  onClick={() => handleSpeedChange(1)} 
                  style={speed === 1 ? styles.activeSpeedButton : styles.speedButton}
                >
                  1x
                </button>
                <button 
                  onClick={() => handleSpeedChange(2)} 
                  style={speed === 2 ? styles.activeSpeedButton : styles.speedButton}
                >
                  2x
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={styles.info}>
            <h3 style={styles.infoTitle}>ℹ️ Come aggiungere le tue animazioni</h3>
            <ol style={styles.infoList}>
              <li>Scarica animazioni da <a href="https://lottiefiles.com" target="_blank" rel="noopener noreferrer" style={styles.infoLink}>LottieFiles.com</a></li>
              <li>Metti il file .json in <code style={styles.code}>public/animations/</code></li>
              <li>Importa: <code style={styles.code}>import myAnimation from '../public/animations/nome-file.json'</code></li>
              <li>Usa: <code style={styles.code}>&lt;Lottie animationData={`{myAnimation}`} /&gt;</code></li>
            </ol>
          </div>
        </div>

        <div style={styles.navigation}>
          <a href="/" style={styles.link}>← Torna alla Griglia Tetris</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    backgroundColor: '#fff',
    padding: '30px',
    borderBottom: '2px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#333',
  },
  subtitle: {
    margin: '8px 0 0 0',
    fontSize: '16px',
    color: '#666',
  },
  content: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px 60px 20px', // Aggiunto padding-bottom per spazio finale
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  description: {
    textAlign: 'center' as const,
    color: '#666',
    marginBottom: '30px',
  },
  animationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  controls: {
    backgroundColor: '#f0f4ff',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  controlsTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#333',
    textAlign: 'center' as const,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  controlButton: {
    fontSize: '16px',
    padding: '12px 24px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '600' as const,
  },
  speedControl: {
    textAlign: 'center' as const,
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#555',
  },
  speedButton: {
    fontSize: '14px',
    padding: '8px 20px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeSpeedButton: {
    fontSize: '14px',
    padding: '8px 20px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600' as const,
  },
  info: {
    backgroundColor: '#fffbea',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'left' as const,
  },
  infoTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#856404',
  },
  infoList: {
    margin: '0',
    paddingLeft: '24px',
    lineHeight: '1.8',
    color: '#666',
  },
  infoLink: {
    color: '#0066cc',
    textDecoration: 'none',
    fontWeight: '600' as const,
  },
  code: {
    backgroundColor: '#f4f4f4',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#d63384',
  },
  navigation: {
    marginTop: '30px',
    textAlign: 'center' as const,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600' as const,
  }
};

export default SecondoTest;

