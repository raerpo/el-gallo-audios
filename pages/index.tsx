import type { NextPage } from "next";
import Head from "next/head";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

// Constants
const BASE_URL = "https://pm.radioacktiva.co.prisasd.com/radioacktiva";
const SHOW_NAME = "radio_activa_elgallo";
const SEGMENTS = ["060000_070000", "070000_080000", "080000_090000", "090000_100000", "100000_110000"];

// Utils
const formatDate = (date: string) => {
  return date.split("-").join("/").split("/0").join("/");
}

// Page
const Home: NextPage = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [audiosURLs, setAudiosURLs] = useState<string[]>([]);

  const getURLsFromDate = (date: string) => {
    const allUrls = SEGMENTS.map(segment => `${BASE_URL}/${formatDate(date)}/${SHOW_NAME}_${date.split("-").join("")}_${segment}.mp3`);
    const urlsPromises = allUrls.map(url => fetch(url));
    Promise.all(urlsPromises).then(responses => {
      const validResponses = responses.filter(response => response.status === 200);
      setAudiosURLs(validResponses.map(response => response.url));
    })
  }

  useEffect(() => {
    getURLsFromDate(date);
  }, [date])

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
          <label>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>
      {audiosURLs.length > 0 && <main className={styles.main}>{audiosURLs.map(url => <div key={url}><a target="_blank" rel="noreferrer" href={url}>{url}</a></div>)}</main>}
    </div>
  );
};

export default Home;
