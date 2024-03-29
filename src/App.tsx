import React, {useEffect, useState} from 'react';
import {ReactComponent as Logo} from './assets/images/logo.svg';
import {ReactComponent as Search} from './assets/images/icons/search.svg';
import search from './assets/images/icons/search.svg';
import './styles/App.scss';
import Album, {AlbumProps, IAlbum} from "./components/Album";
import useDebounce from "./use-debounce";
import AlbumSkeleton from "./components/AlbumSkeleton";
import PlayerPane from "./components/PlayerPane";
import useWindowSize, {Size} from "./use-window-size";


export default function App() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 800);
    const [albumsLoading, setLoadingStatus] = useState<boolean>(false);
    const [selectedAlbum, setSelectedAlbum] = useState<(IAlbum | null)>(null);
    const [playerPaneStatus, setPlayerPaneStatus] = useState(false);
    const windowSize: Size = useWindowSize();

    const renderAlbums = (albums: IAlbum[], albumsLoading: boolean) => {
        if (!albumsLoading) {
            return albums.map((album, index) => {
                return <Album album={album} key={index} playerPaneStatus={playerPaneStatus}
                              setAlbum={setSelectedAlbum}
                              setPlayerPaneStatus={setPlayerPaneStatus}/>;
            });

        } else {
            // @ts-ignore
            return [...Array(50).keys()].map((n) => {
                return <AlbumSkeleton key={n}/>;
            });

        }
    }
    const baseApiUrl = '';
    const getAlbums = async (searchText: string): Promise<IAlbum[]> => {
        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(searchText),
        };
        return await fetch(baseApiUrl + '/api/Vk', requestOptions)
            .then((res) => res.json())
            .then((body) => body);
    };

    const getPopular = async (genreId: number): Promise<IAlbum[]> => {
        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(genreId),
        };
        return await fetch(baseApiUrl + '/api/Vk/GetPopular', requestOptions)
            .then((res) => res.json())
            .then((body) => body);
    };

    useEffect(() => {
        // Make sure we have a value (user has entered something in input)
        if (debouncedSearchTerm) {
            // Fire off our API call
            getAlbums(debouncedSearchTerm).then((results) => {
                // Set back to false since request finished
                setLoadingStatus(false);
                // Set results state
                setAlbums(results);
                document.getElementsByClassName('albums-container')[0].scrollTo(0, 0);


            });

        } else {
            setLoadingStatus(true);
            getPopular(1).then((results) => {
                // Set back to false since request finished
                setLoadingStatus(false);
                // Set results state
                setAlbums(results);
                document.getElementsByClassName('albums-container')[0].scrollTo(0, 0);
            });
        }
    }, [debouncedSearchTerm]);

    const OnChangeSearch = (searchText: string) => {
        setLoadingStatus(true);
        setSearchTerm(searchText);
    }



    return (
        <div className={`App ${playerPaneStatus ? "player-pane-active" : ""}`}>
            <header className="header">
                <div className="header__logo">
                    <div className="header__logo-image">
                        <Logo/>
                    </div>
                    <span className="header__logo-text">Musician hub</span>
                </div>
                <div className="header__search">
                    <div className="header__search-container">
                        <div className="header__search-icon">
                            <Search/>
                        </div>
                        <input className="header__search-input" type="text" placeholder="Search"
                               onChange={(e) => OnChangeSearch(e.target.value)}/>
                    </div>
                </div>
            </header>

                <div className="title">Albums</div>

                <div className="albums-container" style={ // @ts-ignore
                    playerPaneStatus && windowSize?.width < 769 ? {bottom: '120px'
                    } : {}}>
                    {renderAlbums(albums, albumsLoading)}
                </div>

            {
                // @ts-ignore
                selectedAlbum && <PlayerPane album={selectedAlbum} playerPaneStatus={playerPaneStatus}/>
            }


        </div>
    );
}



