import React, {useEffect, useRef, useState} from "react";
import '../styles/player-pane.scss'
import {AlbumProps} from "./Album";
import Hls from 'hls.js';
import {ITrack} from "./Track";
import {ReactComponent as Equalizer} from '../assets/images/icons/equalizer.svg';
import {ReactComponent as Prev} from '../assets/images/icons/prev.svg';
import {ReactComponent as Next} from '../assets/images/icons/next.svg';
import {ReactComponent as Play} from '../assets/images/icons/play.svg';
import {ReactComponent as Pause} from '../assets/images/icons/pause.svg';
import useWindowSize, {Size} from "../use-window-size";
import {log} from "util";




const getTime = (time: number) => {
    return (
        Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
}




const PlayerPane: React.FC<AlbumProps> = ({album, playerPaneStatus}) => {

    // const config = {
    //     //@ts-ignore
    //     fetchSetup: function (context, initParams) {
    //         // Always send cookies, even for cross-origin calls.
    //         let myHeaders = new Headers();
    //         myHeaders.append('X-Requested-With', 'XMLHttpRequest');
    //         initParams.headers = myHeaders;
    //         return new Request(context.url, initParams);
    //     },
    // };
    //@ts-ignore
    // const xhrSetupFn = (xhr, url) => {
    //     if (url.indexOf('.vkuseraudio.net') === 0) {
    //         let a = 'https://secret-ocean-49799.herokuapp.com/';
    //         let b = url;
    //          let c = a + b;
    //         xhr.open('GET', c, true);
    //     }
    // }
    const config = {
         //@ts-ignore
        xhrSetup: function(xhr, url){
            //@ts-ignore
            xhr.beforeRequest = function(options){
                options.uri = 'https://secret-ocean-49799.herokuapp.com/' + options.uri;
                //.replace('cloudfront.net', 'foo.com');
                console.log(options);
                return options;
            };
        }
    };
    //@ts-ignore
    const _hlsInstance: Hls = new Hls(config);

    const [currentTrack, setCurrentTrack] = useState<ITrack>(album.tracks[0]);
    const audioRef = useRef(null);
    const [trackInfo, setTrackInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0,
        volume: 0,
    });

    const [playingStatus, setPlayingStatus] = useState({});

    const loadSource = (src: string) => {

        if (Hls.isSupported()) {

            _hlsInstance.loadSource(src);
            // @ts-ignore
            _hlsInstance.attachMedia(audioRef.current);

        } else { // @ts-ignore
            if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // @ts-ignore
                audioRef.current.src = 'https://secret-ocean-49799.herokuapp.com/' + currentTrack.src;
                // @ts-ignore
                audioRef.current.pause();
            }
        }
    }

    const playAudio = (audioRef: React.MutableRefObject<any>) => {
        // @ts-ignore
        if (!playingStatus[currentTrack.number] && audioRef.current) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            audioRef.current.play();
                            // @ts-ignore
                            playingStatus[currentTrack.number] = true;
                            // @ts-ignore
                            setPlayingStatus(playingStatus);
                            // @ts-ignore
                            document.getElementById('bar1').style.animationPlayState = 'running';
                            // @ts-ignore
                            document.getElementById('bar2').style.animationPlayState = 'running';
                            // @ts-ignore
                            document.getElementById('bar3').style.animationPlayState = 'running';
                            // @ts-ignore
                            document.getElementById('bar4').style.animationPlayState = 'running';
                        })
                        .catch((error: any) => {
                            // console.log(error);
                        });
                }

        }
        // @ts-ignore
        else if(playingStatus[currentTrack.number] && audioRef.current){
            audioRef.current.pause();
            // @ts-ignore
            playingStatus[currentTrack.number] = false;
            // @ts-ignore
            setPlayingStatus(playingStatus);
            // @ts-ignore
            document.getElementById('bar1').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar2').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar3').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar4').style.animationPlayState = 'paused';
        }
    };
    const dragHandler = (e: React.ChangeEvent<HTMLInputElement>, audioRef: React.MutableRefObject<any>) => {
        audioRef.current.currentTime = e.target.value;
        // @ts-ignore
        setTrackInfo({...trackInfo, currentTime: e.target.value});
        // @ts-ignore
        if(playingStatus[currentTrack.number] !== undefined && !playingStatus[currentTrack.number]){
            playAudio(audioRef);
        }
    };

    const timeUpdateHandler = (audioElem: HTMLAudioElement) => {
        const current = audioElem.currentTime;
        const duration = audioElem.duration;

        const roundedCurrent = Math.round(current);
        const roundedDuration = Math.round(duration);
        const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
        setTrackInfo({
            ...trackInfo,
            currentTime: current,
            duration: duration,
            animationPercentage: percentage,
            volume: audioElem.volume,
        });
    };
    const trackEndHandler = async () => {
        let currentIndex = album.tracks.findIndex((track) => {
            return track.number === currentTrack.number;
        });
        // @ts-ignore
        await setPlayingStatus({})
        await setCurrentTrack(album.tracks[(currentIndex + 1) % album.tracks.length]);
        return;
    };


   const checkAudioRef = () => {
       if(audioRef.current){
           // @ts-ignore
           if(playingStatus[currentTrack.number] === undefined){
               loadSource(currentTrack.src);
           }
           playAudio(audioRef);
       }
       else{
           setTimeout(() =>{
               checkAudioRef();
           },1)
       }


   }
    useEffect(() => {

        if(!currentTrack){
            setCurrentTrack(album.tracks[0]);
        }
        else {
            //@ts-ignore
            document.getElementsByClassName('player-pane-container__playlist-item')[currentTrack.number].scrollIntoViewIfNeeded();
            checkAudioRef()
        }

    }, [currentTrack]);

    useEffect(() => {

        if(playerPaneStatus && isSwapped){
            setIsSwapped(false);
            document.getElementsByClassName('swapped-player-pane')[0].classList.remove('swapped-player-pane');
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'visible';
        }


        setPlayingStatus({});
        setCurrentTrack(album.tracks[0]);
    }, [album]);


    const onClickPlaylistItem = (track: ITrack) => {
        if(track === currentTrack){
            checkAudioRef();
        }
        else{
            setPlayingStatus({});
            setCurrentTrack(track);
        }


    }



    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [touchMoved, setTouchMoved] = useState(false);
    const [isSwapped, setIsSwapped] = useState(false);

    const windowSize: Size = useWindowSize();

    useEffect(() => {
        // @ts-ignore
        if(windowSize.width > 768){
            setIsSwapped(false);
            if(document.getElementsByClassName('swapped-player-pane').length > 0){
                document.getElementsByClassName('swapped-player-pane')[0].classList.remove('swapped-player-pane');
            }
            document.body.style.overflow = 'visible';
        }
    }, [windowSize]);

    const handleTouchStart = (touchEvent: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(touchEvent.targetTouches[0].clientY);
    }

    const handleTouchMove = (touchEvent: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(touchEvent.targetTouches[0].clientY);
        setTouchMoved(true);
    }

    const handleTouchEnd = (touchEvent: React.TouchEvent<HTMLDivElement>) => {
        if(touchMoved) {
            // @ts-ignore
            if (touchStart - touchEnd < -1) {
                setIsSwapped(true);
                touchEvent.currentTarget.classList.add('swapped-player-pane');
                document.body.style.overflow = 'visible';
            }

            // @ts-ignore
            if (touchStart - touchEnd > 1) {
                setIsSwapped(false);
                touchEvent.currentTarget.classList.remove('swapped-player-pane');
                document.body.style.overflow = 'hidden';
            }
            setTouchMoved(false);
        }
    }

    const previousTrackHandler = () => {
        let currentIndex = album.tracks.findIndex((track) => {
            return track.number === currentTrack.number;
        });
        setPlayingStatus({})
        setCurrentTrack(album.tracks[(currentIndex - 1)]);
    }
    const nextTrackHandler = () => {
        let currentIndex = album.tracks.findIndex((track) => {
            return track.number === currentTrack.number;
        });
        setPlayingStatus({})
        setCurrentTrack(album.tracks[(currentIndex + 1) % album.tracks.length]);
    }


    return (
                    <div className={`player-pane ${playerPaneStatus ? "active-player-pane" : ""}`} onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                         onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                         onTouchEnd={(touchEndEvent) => handleTouchEnd(touchEndEvent)}>

                        <div className="player-pane-container" style={isSwapped ? {padding: '10px', gap: '16px'}: undefined}>

                            <div className="player-pane-container__description" style={isSwapped ? {height: '48px', justifyContent: 'space-between'}: undefined}>
                                <div className="player-pane-container__description-image" style={isSwapped ? {width: '48px'}: {}}>
                                    <img src={album.smallThumbnailSrc} alt=""/>
                                </div>
                                <div className="player-pane-container__album-info" style={isSwapped ? {alignItems: 'center'}: undefined}>
                                    <div className={`player-pane-container__album-name ${isSwapped ? "headline-text": ""}`}>{isSwapped ? currentTrack.name : album.name}</div>
                                    <div className={`player-pane-container__artist-name ${isSwapped ? "subheadline-text": ""}`}>{album.artist}</div>
                                </div>
                                {isSwapped ?

                                        // @ts-ignore
                                        playingStatus[currentTrack?.number] ?
                                            <Pause
                                                className="player-pane-container__player-controls-play-pause-icon" style={isSwapped ? {marginRight: '15px'} : undefined}
                                                onClick={() => playAudio(audioRef)}/> :
                                            <Play
                                                className="player-pane-container__player-controls-play-pause-icon" style={isSwapped ? {marginRight: '15px'} : undefined}
                                                onClick={() => playAudio(audioRef)}/>
                                    :
                                    ''
                                }
                            </div>

                            <div className="player-pane-container__time-control" style={isSwapped ? {height: 'auto'} : undefined}>
                                <div className="player-pane-container__progress"
                                     >

                                    <input style={{
                                        background: `linear-gradient(to right, #dcdce0 0%, #dcdce0 ${(trackInfo.currentTime-0)/((trackInfo.duration || 0)-0)*100}%, transparent ${(trackInfo.currentTime-0)/((trackInfo.duration || 0)-0)*100}%, transparent 100%)`,
                                    }}
                                        value={trackInfo.currentTime}
                                        type="range"
                                        max={trackInfo.duration || 0}
                                        min={0}
                                        onChange={(e) => {
                                            dragHandler(e, audioRef)
                                        }}
                                    />
                                </div>
                                <div className="player-pane-container__time-control-duration">
                                    <div
                                        className="player-pane-container__time-control-passed">{getTime(trackInfo.currentTime)}</div>
                                    <div
                                        className="player-pane-container__time-control-all">{trackInfo.duration ? getTime(trackInfo.duration) : "0:00"}</div>
                                </div>
                            </div>
                            <div className="player-pane-container__player-controls" style={isSwapped ? {display: 'none'} : undefined}>
                                    <Prev className="player-pane-container__player-controls-prev-icon" onClick={previousTrackHandler}/>

                                {
                                    // @ts-ignore
                                    playingStatus[currentTrack?.number] ?
                                        <Pause
                                            className="player-pane-container__player-controls-play-pause-icon" onClick={() => playAudio(audioRef)}/> :
                                        <Play
                                            className="player-pane-container__player-controls-play-pause-icon" onClick={() => playAudio(audioRef)}/>
                                }

                                    <Next className="player-pane-container__player-controls-next-icon" onClick={nextTrackHandler}/>
                            </div>
                            <div className="player-pane-container__playlist" style={isSwapped ? {display: 'none'} : undefined}>
                                {album.tracks.map((track) => {


                                    return (

                                        <div className="player-pane-container__playlist-item" key={track.number} onClick={()=>{
                                            onClickPlaylistItem(track)
                                        }}>
                                            <div className="player-pane-container__playlist-item-col">
                                                <div className="player-pane-container__playlist-item-row">

                                                <div
                                                    // @ts-ignore
                                                    className="player-pane-container__playlist-item-position" style={{display: playingStatus[track.number] !== undefined ? "none" : "block"}}>{track.number + 1}</div>


                                                        {
                                                            // @ts-ignore
                                                            playingStatus[track?.number] !== undefined ?
                                                                <Equalizer className="player-pane-container__playlist-item-equalizer-icon"/>
                                                                :
                                                                ''
                                                        }



                                                <div
                                                    className="player-pane-container__playlist-item-name">{track.name}</div>
                                            </div>
                                            </div>
                                            <div className="player-pane-container__playlist-item-col">
                                                <div className="player-pane-container__playlist-item-row">
                                            <div
                                                className="player-pane-container__playlist-item-artist">{track.artist}</div>
                                            <div
                                                className="player-pane-container__playlist-item-duration">{getTime(track.time)}</div>
                                                </div>
                                            </div>
                                        </div>


                                    )
                                })
                                }
                            </div>
                            <audio
                                //@ts-ignore
                                onLoadedMetadata={(e) => timeUpdateHandler(e.target)}
                                //@ts-ignore
                                onTimeUpdate={(e) => timeUpdateHandler(e.target)}
                                ref={audioRef}
                                onEnded={trackEndHandler}
                            ></audio>
                        </div>
                    </div>
    )

}

export default PlayerPane;
