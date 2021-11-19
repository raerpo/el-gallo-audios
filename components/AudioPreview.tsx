import { AudioData } from "../pages";
import styles from "../styles/AudioPreview.module.css";

interface AudioPreviewProps extends AudioData {
    onClick: (audioData: AudioData) => void;
    isActive?: boolean;
}

const AudioPreview = ({ onClick, isActive, ...audioData }: AudioPreviewProps) => {
    return <li onClick={() => onClick(audioData)} className={`${styles.audioPreview} ${isActive && styles.audioPreviewActive}`}>
        <h3>{audioData.name}</h3>
    </li>
}

export default AudioPreview;