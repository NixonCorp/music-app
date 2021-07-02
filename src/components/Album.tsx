import React, {useState} from "react";
import '../styles/album.scss'
import {ITrack} from "./Track";
import { LazyLoadImage } from 'react-lazy-load-image-component';
export interface IAlbum {
  artist: string;
  name: string;
  smallThumbnailSrc: string;
  normalThumbnailSrc: string;
  tracks: ITrack[];

}
export interface AlbumProps {
    album: IAlbum;
    playerPaneStatus: boolean;
    setAlbum(album: IAlbum): void;
    setPlayerPaneStatus(playerPaneStatus: boolean): void;
}

const Album: React.FC<AlbumProps> = ({album,playerPaneStatus, setAlbum, setPlayerPaneStatus }) => {


return (
    <div className="album-container" onClick={() =>{
        if(!playerPaneStatus)
            setPlayerPaneStatus(!playerPaneStatus);
        setAlbum(album)
    }}>
        <div className="album-container__album-image">
           <LazyLoadImage src={album.normalThumbnailSrc} alt=""/>
        </div>
        <div className="album-container__album-info">
            <div className="album-container__album-name">{album.name}</div>
            <div className="album-container__artist-name">{album.artist}</div>
        </div>
    </div>
)

}

export default Album;
