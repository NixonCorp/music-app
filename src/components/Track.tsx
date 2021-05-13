import React from "react";
import '../styles/track.scss'

export interface ITrack {
    number: number;
    name: string;
    artist: string;
    src: string;
    time: number;
}

const Track: React.FC<ITrack> = (props) => {
    return (
        <div className="container">
            <div className="container__track-number">{props.number}</div>
            <div className="container__track-name">{props.name}</div>
            <div className="container__track-artist">{props.artist}</div>
            <div className="container__track-time">{props.time}</div>
        </div>
    )

}

export default Track;
