import React, {CSSProperties} from "react";
import '../styles/album.scss'
import Skeleton from "react-loading-skeleton";


const albumNameStyles: CSSProperties = {
    width: 120,
    height: 20
}
const artistNameStyles: CSSProperties = {
    width: 100,
    height: 12
}

const AlbumSkeleton = () => {
    return (
        <div className="album-containe">
            {<Skeleton className={"album-container__album-image"}/>}
            <div className="album-container__album-info">
                {<Skeleton className={"album-container__album-name"} style={albumNameStyles}/>}
                {<Skeleton className={"album-container__artist-name"} style={artistNameStyles}/>}
            </div>
        </div>
    )
}

export default AlbumSkeleton;
