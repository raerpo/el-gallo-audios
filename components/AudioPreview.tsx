import { AudioData } from "../pages";
import styles from "../styles/AudioPreview.module.css";

interface AudioPreviewProps extends AudioData {
    onClick: (audioData: AudioData) => void;
    isActive?: boolean;
}

const AudioPreview = ({ onClick, isActive, ...audioData }: AudioPreviewProps) => {
    return <li onClick={() => onClick(audioData)} className={`${styles.audioPreview} ${isActive && styles.audioPreviewActive}`}>
        <button type="button">{audioData.name}</button>
    </li>
}

export default AudioPreview;