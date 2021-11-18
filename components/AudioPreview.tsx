import { AudioData } from "../pages";

interface AudioPreviewProps extends AudioData {
    onClick: (audioData: AudioData) => void
}

const AudioPreview = ({ onClick, ...audioData }: AudioPreviewProps) => {
    return <li onClick={() => onClick(audioData)}>
        <h3>{audioData.name}</h3>
    </li>
}

export default AudioPreview;