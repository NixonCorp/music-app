import React, {useEffect, useRef, useState} from "react";
import '../styles/player-pane.scss'
import {AlbumProps} from "./Album";
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
    //
    //     let a = 'https://secret-ocean-49799.herokuapp.com/';
    //     let b = url;
    //     let c = a + b;
    //     if (url.indexOf('.vkuseraudio.net') === 0) {
    //         xhr.open('GET', 'https://google.com', true);
    //     }
    // }

    // const config = {
    //
    //     // @ts-ignore
    //     xhrSetup: function (xhr, url) {
    //         xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    //         xhr.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    //         xhr.setRequestHeader(
    //             "Access-Control-Allow-Headers",
    //             "*"
    //         );
    //         xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    //         xhr.setRequestHeader("Access-Control-Expose-Headers", "Content-Length, X-JSON");
    //
    //
    //
    //     }
    // };

    //@ts-ignore
    //const _hlsInstance: Hls = new Hls();

    const [currentTrack, setCurrentTrack] = useState<ITrack>(album.tracks[0]);
    const audioRef = useRef(null);
    const [trackInfo, setTrackInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0,
        volume: 0,
    });

    const changeUrl = (url: string): string => {
        if (url.indexOf('psv') !== -1 && url.indexOf('audios') !== -1) {
            const parts = url.split('?');

            const firstParts = parts[0].split('/');

            return `${firstParts[0]}//${firstParts[2]}/${firstParts[3]}/${firstParts[4]}/${firstParts[6]}/${firstParts[7]}.mp3?${parts[1]}`;
        } else {
            const parts = url.split('?');

            const firstParts = parts[0].split('/');

            return `${firstParts[0]}//${firstParts[2]}/${firstParts[3]}/${firstParts[5]}.mp3?${parts[1]}`;
        }
    }

    const [playingStatus, setPlayingStatus] = useState({});

    const loadSource = (src: string) => {

        // @ts-ignore
        audioRef.current.src = changeUrl(src);
        // if (Hls.isSupported()) {
        //
        //     _hlsInstance.loadSource(changeUrl(src));
        //     // @ts-ignore
        //     _hlsInstance.attachMedia(audioRef.current);
        //
        // } else { // @ts-ignore
        //     if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        //         // @ts-ignore
        //         audioRef.current.src = changeUrl(src);
        //         // @ts-ignore
        //         audioRef.current.pause();
        //     }
        // }
    }

    const playAudio = (audioRef: React.MutableRefObject<any>) => {

        // @ts-ignore
        if (!playingStatus[currentTrack.number] && audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        audioRef.current.play();
                        afterPlayAction();
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            }

        }
        // @ts-ignore
        else if (playingStatus[currentTrack.number] && audioRef.current) {
            audioRef.current.pause();
            afterPauseAction();
        }

    };
    const dragHandler = (e: React.ChangeEvent<HTMLInputElement>, audioRef: React.MutableRefObject<any>) => {
        audioRef.current.currentTime = e.target.value;
        // @ts-ignore
        setTrackInfo({...trackInfo, currentTime: e.target.value});
        // @ts-ignore
        if (playingStatus[currentTrack.number] !== undefined && !playingStatus[currentTrack.number]) {
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
        if (audioRef.current) {
            // @ts-ignore
            if (playingStatus[currentTrack.number] === undefined) {
                loadSource(currentTrack.src);
            }
            playAudio(audioRef);
        } else {
            setTimeout(() => {
                checkAudioRef();
            }, 1)
        }


    }
    useEffect(() => {

        if (!currentTrack) {
            setCurrentTrack(album.tracks[0]);
        } else {
            //@ts-ignore
            document.getElementsByClassName('player-pane-container__playlist-item')[currentTrack.number].scrollIntoViewIfNeeded();
            checkAudioRef()
        }

    }, [currentTrack]);

    useEffect(() => {

        if (playerPaneStatus && isSwapped) {
            setIsSwapped(false);
            document.getElementsByClassName('swapped-player-pane')[0].classList.remove('swapped-player-pane');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            // @ts-ignore
            document.getElementsByClassName('player-pane')[0].style.top = '';
        } else if (playerPaneStatus && !isSwapped) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
        } else {
            document.body.style.overflow = 'visible';
            document.body.style.position = '';
        }


        setPlayingStatus({});
        setCurrentTrack(album.tracks[0]);
    }, [album]);


    const onClickPlaylistItem = (track: ITrack) => {
        if (track === currentTrack) {
            checkAudioRef();
        } else {
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
        if (windowSize.width > 768) {
            maximazePlayerPane(false);
        } else {
            maximazePlayerPane(true);
        }
    }, [windowSize]);

    const handleTouchStart = (touchEvent: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(touchEvent.targetTouches[0].clientY);
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
    }

    const handleTouchMove = (touchEvent: React.TouchEvent<HTMLDivElement>) => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        //@ts-ignore
        document.getElementsByClassName('player-pane')[0].style.top = touchEvent.targetTouches[0].clientY + 'px';
        setTouchEnd(touchEvent.targetTouches[0].clientY);
        setTouchMoved(true);
    }

    const handleTouchEnd = (touchEvent: React.TouchEvent<HTMLDivElement>) => {

        if (touchMoved) {
            // @ts-ignore
            if (touchStart - touchEnd < -1) {
                minimazePlayerPane();
            }

            // @ts-ignore
            if (touchStart - touchEnd > 1) {
                maximazePlayerPane();
            }
            setTouchMoved(false);
        }
    }

    const maximazePlayerPane = (isMobile: boolean = true) => {
        //@ts-ignore
        document.getElementsByClassName('player-pane')[0].style.top = '20px';
        setIsSwapped(false);
        document.getElementsByClassName('player-pane')[0].classList.remove('swapped-player-pane');
        document.body.style.overflow = isMobile ? 'hidden' : 'visible';
        document.body.style.position = isMobile ? 'fixed' : '';
    }

    const minimazePlayerPane = () => {
        //@ts-ignore
        document.getElementsByClassName('player-pane')[0].style.top = 'auto';
        setIsSwapped(true);
        document.getElementsByClassName('player-pane')[0].classList.add('swapped-player-pane');
        document.body.style.overflow = 'visible';
        document.body.style.position = '';
    }

    const onSwapperClick = () => {
        if (isSwapped) {
            maximazePlayerPane();
        } else {
            minimazePlayerPane();
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

    const afterPlayAction = () => {
        // @ts-ignore
        playingStatus[currentTrack.number] = true;
        // @ts-ignore
        setPlayingStatus(playingStatus);
        if (document.getElementById('bar1') &&
            document.getElementById('bar2') &&
            document.getElementById('bar3') &&
            document.getElementById('bar4')) {
            // @ts-ignore
            document.getElementById('bar1').style.animationPlayState = 'running';
            // @ts-ignore
            document.getElementById('bar2').style.animationPlayState = 'running';
            // @ts-ignore
            document.getElementById('bar3').style.animationPlayState = 'running';
            // @ts-ignore
            document.getElementById('bar4').style.animationPlayState = 'running';
        }
    }

    const afterPauseAction = () => {
        // @ts-ignore
        playingStatus[currentTrack.number] = false;
        // @ts-ignore
        setPlayingStatus(playingStatus);
        if (document.getElementById('bar1') &&
            document.getElementById('bar2') &&
            document.getElementById('bar3') &&
            document.getElementById('bar4')) {
            // @ts-ignore
            document.getElementById('bar1').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar2').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar3').style.animationPlayState = 'paused';
            // @ts-ignore
            document.getElementById('bar4').style.animationPlayState = 'paused';
        }
    }

    const handlePlayEventOutsideOfApp = (onPlay: boolean) => {
        if (onPlay) {
            afterPlayAction();
        } else {
            afterPauseAction();
        }

    }

    return (
        <div className={`player-pane ${playerPaneStatus ? "active-player-pane" : ""}`}>
            <div className={`player-pane__swapper ${isSwapped ? "player-pane__swapped-mode" : ""}`}
                 onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                 onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                 onTouchEnd={(touchEndEvent) => handleTouchEnd(touchEndEvent)} onClick={onSwapperClick}>
                <div className="player-pane__swapper-btn"></div>
            </div>
            <div className="player-pane-container" style={isSwapped ? {padding: '10px', gap: '16px'} : undefined}>

                <div className="player-pane-container__description"
                     style={isSwapped ? {height: '48px', justifyContent: 'space-between'} : undefined}>
                    <div className="player-pane-container__description-image"
                         style={isSwapped ? {width: '48px'} : undefined}>
                        <img src={album.smallThumbnailSrc} alt=""/>
                    </div>
                    <div className="player-pane-container__album-info"
                         style={isSwapped ? {alignItems: 'center'} : undefined}>
                        <div
                            className={`player-pane-container__album-name ${isSwapped ? "headline-text" : ""}`}>{isSwapped ? currentTrack.name : album.name}</div>
                        <div
                            className={`player-pane-container__artist-name ${isSwapped ? "subheadline-text" : ""}`}>{album.artist}</div>
                    </div>
                    {isSwapped ?

                        // @ts-ignore
                        playingStatus[currentTrack?.number] ?
                            <Pause
                                className="player-pane-container__player-controls-play-pause-icon"
                                style={isSwapped ? {marginRight: '15px'} : undefined}
                                onClick={() => playAudio(audioRef)}/> :
                            <Play
                                className="player-pane-container__player-controls-play-pause-icon"
                                style={isSwapped ? {marginRight: '15px'} : undefined}
                                onClick={() => playAudio(audioRef)}/>
                        :
                        ''
                    }
                </div>

                <div className="player-pane-container__time-control" style={isSwapped ? {height: 'auto'} : undefined}>
                    <div className="player-pane-container__progress"
                    >

                        <input style={{
                            background: `linear-gradient(to right, #dcdce0 0%, #dcdce0 ${(trackInfo.currentTime - 0) / ((trackInfo.duration || 0) - 0) * 100}%, transparent ${(trackInfo.currentTime - 0) / ((trackInfo.duration || 0) - 0) * 100}%, transparent 100%)`,
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
                <div className="player-pane-container__player-controls"
                     style={isSwapped ? {display: 'none'} : undefined}>
                    <Prev className="player-pane-container__player-controls-prev-icon" onClick={previousTrackHandler}/>

                    {
                        // @ts-ignore
                        playingStatus[currentTrack?.number] ?
                            <Pause
                                className="player-pane-container__player-controls-play-pause-icon"
                                onClick={() => playAudio(audioRef)}/> :
                            <Play
                                className="player-pane-container__player-controls-play-pause-icon"
                                onClick={() => playAudio(audioRef)}/>
                    }

                    <Next className="player-pane-container__player-controls-next-icon" onClick={nextTrackHandler}/>
                </div>
                <div className="player-pane-container__playlist" style={isSwapped ? {display: 'none'} : undefined}>
                    {album.tracks.map((track) => {


                        // @ts-ignore
                        return (

                            <div className="player-pane-container__playlist-item" key={track.number} onClick={() => {
                                onClickPlaylistItem(track)
                            }}>
                                <div className="player-pane-container__playlist-item-col">
                                    <div className="player-pane-container__playlist-item-row">

                                        <div
                                            className="player-pane-container__playlist-item-position"
                                            // @ts-ignore
                                            style={{display: playingStatus[track.number] !== undefined ? "none" : "block"}}>{track.number + 1}</div>


                                        {
                                            // @ts-ignore
                                            playingStatus[track?.number] !== undefined ?
                                                <svg className="player-pane-container__playlist-item-equalizer-icon"
                                                     viewBox="0 0 10 7" version="1.1"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <g fill="#FEDC54">
                                                        <rect id="bar1"
                                                              transform="translate(0.500000, 6.000000) rotate(180.000000) translate(-0.500000, -6.000000) "
                                                              x="0" y="5" width="1" height="2px"></rect>
                                                        <rect id="bar2"
                                                              transform="translate(3.500000, 4.500000) rotate(180.000000) translate(-3.500000, -4.500000) "
                                                              x="3" y="2" width="1" height="5"></rect>
                                                        <rect id="bar3"
                                                              transform="translate(6.500000, 3.500000) rotate(180.000000) translate(-6.500000, -3.500000) "
                                                              x="6" y="0" width="1" height="7"></rect>
                                                        <rect id="bar4"
                                                              transform="translate(9.500000, 5.000000) rotate(180.000000) translate(-9.500000, -5.000000) "
                                                              x="9" y="3" width="1" height="4"></rect>
                                                    </g>
                                                </svg>

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
                <audio preload="auto"
                    //@ts-ignore
                       onLoadedMetadata={(e) => timeUpdateHandler(e.target)}
                    //@ts-ignore
                       onTimeUpdate={(e) => timeUpdateHandler(e.target)}
                       ref={audioRef}
                       onPause={() => handlePlayEventOutsideOfApp(false)}
                       onPlay={() => handlePlayEventOutsideOfApp(true)}
                       onEnded={trackEndHandler}
                ></audio>
            </div>
        </div>
    )

}

export default PlayerPane;
