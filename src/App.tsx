import React, {useEffect, useState} from 'react';
import {ReactComponent as Logo} from './assets/images/logo.svg';
import {ReactComponent as Search} from './assets/images/icons/search.svg';
import search from './assets/images/icons/search.svg';
import './styles/App.scss';
import Album, {AlbumProps, IAlbum} from "./components/Album";
import useDebounce from "./use-debounce";
import AlbumSkeleton from "./components/AlbumSkeleton";
import PlayerPane from "./components/PlayerPane";



function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 800);
    const [albumsLoading, setLoadingStatus] = useState<boolean>(false);
    const [selectedAlbum, setSelectedAlbum] = useState<(IAlbum | null)>(null);
    const [playerPaneStatus, setPlayerPaneStatus] = useState(false);
    const renderAlbums = (albums: IAlbum[], albumsLoading: boolean) => {
        if (!albumsLoading) {
            return albums.map((album, index) => {
                return <Album album={album} key={index} playerPaneStatus={playerPaneStatus} setAlbum={setSelectedAlbum}
                              setPlayerPaneStatus={setPlayerPaneStatus}/>;
            });
        } else {
            // @ts-ignore
            return [...Array(50).keys()].map((n) => {
                return <AlbumSkeleton key={n}/>;
            });

        }
    }
    const getAlbums = async (searchText: string): Promise<IAlbum[]> => {
        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(searchText),
        };
        return await fetch('http://localhost:5003/api/Vk', requestOptions)
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
        return await fetch('http://localhost:5003/api/Vk/GetPopular', requestOptions)
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
            });

        } else {
            getPopular(1).then((results) => {
                // Set back to false since request finished
                setLoadingStatus(false);
                // Set results state
                setAlbums(results);
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
            <div className="albums-container">
                {renderAlbums(albums, albumsLoading)}
            </div>
            {
                // @ts-ignore
                selectedAlbum && <PlayerPane album={selectedAlbum} playerPaneStatus={playerPaneStatus} />
            }


        </div>
    );
}

export default App;
