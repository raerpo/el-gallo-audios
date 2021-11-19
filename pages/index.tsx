import type { NextPage } from "next";
import Head from "next/head";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

// Components
import AudioPreview from "../components/AudioPreview";

// Constants
const BASE_URL = "https://pm.radioacktiva.co.prisasd.com/radioacktiva";
const SHOW_NAME = "radio_activa_elgallo";
const SEGMENTS = [
  "060000_070000",
  "070000_080000",
  "080000_090000",
  "090000_100000",
  "100000_110000",
];

// Utils
const formatDate = (date: string) => {
  return date.split("-").join("/").split("/0").join("/");
};

// Inteface
export interface AudioData {
  name: string;
  url: string;
  date: string;
  segment: string;
}

// Page
const Home: NextPage = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [audiosData, setAudiosData] = useState<AudioData[]>([]);
  const [activeAudio, setActiveAudio] = useState<AudioData>();

  const getURLsFromDate = (date: string) => {
    const allAudiosData: AudioData[] = SEGMENTS.map((segment) => {
      const [hourStart, hourEnd] = segment
        .split("_")
        .map((hour) => hour.split("0000").join(""));
      return {
        name: `El gallo ${date} [${hourStart}AM - ${hourEnd}AM]`,
        url: `${BASE_URL}/${formatDate(date)}/${SHOW_NAME}_${date
          .split("-")
          .join("")}_${segment}.mp3`,
        date,
        segment,
      };
    });

    const urlsPromises = allAudiosData.map((audioData) => fetch(audioData.url));
    Promise.all(urlsPromises).then((responses) => {
      const validResponses = responses.filter(
        (response) => response.status === 200
      );
      const validURLs = validResponses.map((response) => response.url);
      setAudiosData(
        allAudiosData.filter((audioData) => validURLs.includes(audioData.url))
      );
    });
  };

  const handleSetActiveAudio = (audioData: AudioData) => {
    setActiveAudio(audioData);
  };

  useEffect(() => {
    getURLsFromDate(date);
  }, [date]);

  useEffect(() => {
    if (activeAudio) {
      document.title = activeAudio.name;
    }
  }, [activeAudio]);

  return (
    <div className={styles.container}>
      <Head>
        <title>El Gallo Audios</title>
        <meta
          name="description"
          content="Audio del programa el gallo de Radioacktiva"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>El Gallo</h1>
        <div className={styles.dateSelector}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>
      {activeAudio && (
        <div className={styles.audioPlayerContainer}>
          <h2>{activeAudio.name}</h2>
          <audio
            className={styles.audioPlayer}
            src={activeAudio.url}
            controls
            controlsList="nodownload"
            autoPlay
          />
        </div>
      )}
      <div className={styles.audioPreviewsContainer}>
        {audiosData.length > 0 ? (
          <ul className={styles.audioPreviewsList}>
            {audiosData.map((audioData) => (
              <AudioPreview
                key={audioData.url}
                onClick={handleSetActiveAudio}
                isActive={audioData.name === activeAudio?.name}
                {...audioData}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.noAudioMessage}>No hay audios para este dia</p>
        )}
      </div>
    </div>
  );
};

export default Home;
