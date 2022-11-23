import React, { useEffect, useState } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import './doodle.css';
import DoodleControls from './DoodleControls';
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;


const Pixel = (props) => {
    const {x, y, color, handlePixelClick} = props;
    return (
        <div x-attr={x} y-attr={y} className={`pixel ${color}`} onClick={handlePixelClick}/>
    )
}

const PixelRow = (props) => {
    const { pixels, handlePixelClick } = props;
    return pixels.map(pixel => {
        return <Pixel x={pixel.x} y={pixel.y} color={pixel.color} handlePixelClick={handlePixelClick}/>
    })
}

const Doodle = () => {
    const [doodleVersions, setDoodleVersions] = useState({});
    const [currentVersion, setCurrentVersion] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [latestVersion, setLatestVersion] = useState(0)

    useEffect(() => {
        setIsLoaded(false);
        setAuthToken(localStorage.getItem('jwtToken'));
        axios.get(`${REACT_APP_SERVER_URL}/doodles`).then((response) => {
            console.log(response.data.doodleHistory);
            // apply a sort to ensure versions are in order
            updateDoodleHistory(response);
            setIsLoaded(true);
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    const updateDoodleHistory = (response) => {
        if (response.data.doodleHistory) {
            const incomingDoodleVersions = response.data.doodleHistory.doodleVersion.sort((a, b) => a.version - b.version);
            let newCurrentVersion = 0;
            const newDoodleVersions = incomingDoodleVersions.reduce((versionDictionary, version) => {
                versionDictionary[version.version] = version.doodleData;
                newCurrentVersion = version.version;
                return versionDictionary;
            }, {})
            setDoodleVersions(newDoodleVersions);
            setCurrentVersion(newCurrentVersion);
            setLatestVersion(newCurrentVersion);
        }
    }

    const handlePixelClick = (e) => {
        const changeMap = createDoodleChangeMap(doodleVersions[currentVersion])
        let newWorkingVersion = doodleVersions;
        const inputX = e.target.attributes['x-attr'].value;
        const inputY = e.target.attributes['y-attr'].value;
        if (changeMap[`${inputX}-${inputY}`]) {
            // remove item
            newWorkingVersion[currentVersion] = newWorkingVersion[currentVersion].filter(i => `${i.x}-${i.y}` !== `${inputX}-${inputY}`);
        } else {
            // add item
            newWorkingVersion[currentVersion].push({
                // grabbing the x and y dom attributes added to each pixel that is clicked and adding those to our current version
                x: inputX,
                y: inputY
            });
        }
        setDoodleVersions(newWorkingVersion);
        setCurrentVersion(latestVersion);
        // pushing new change up to backend
        setAuthToken(localStorage.getItem('jwtToken'));
        axios({
            method: 'post',
            url: `${REACT_APP_SERVER_URL}/doodles/update`,
            data: {
                version: latestVersion + 1,
                doodleCoords: doodleVersions[latestVersion].map((coord) => {
                    return {
                        xCoord: coord.x,
                        yCoord: coord.y
                    }
                })
            }
        }).then((response) => {
            updateDoodleHistory(response);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const createDoodleChangeMap = (doodleVersion) => {
        return doodleVersion.reduce((doodleDictionary, current) => {
            doodleDictionary[`${current.x}-${current.y}`] = true;
            return doodleDictionary;
        }, {});
    }

    const renderDoodle = () => {
        let userChangesForCurrentVersion = {};
        if (doodleVersions[currentVersion]) {
            userChangesForCurrentVersion = createDoodleChangeMap(doodleVersions[currentVersion]);
        }
        const displayDoodle = [...Array(20)].map((e, pIdx) => Array(20).fill(null).map((i, cIdx) => {
            return {
                x: pIdx,
                y: cIdx,
                color: userChangesForCurrentVersion[`${pIdx}-${cIdx}`] ? 'red' : 'white'
            }
        }))
        return displayDoodle.map(pixelRow => {
            return (
                <div className="pixel-row">
                    <PixelRow pixels={pixelRow} currentValue={setCurrentVersion} handlePixelClick={handlePixelClick}/>
                </div>
            )
        })
    }

    return (
        <div className="doodle-container">
            {isLoaded ? <DoodleControls versions={doodleVersions} currentVersion={currentVersion} setVersion={setCurrentVersion} /> : null }
            {isLoaded ? <div>
                <span>Current Version: {currentVersion}</span>
                {renderDoodle()}
            </div> : <div>...Loading</div>}
        </div>
    )
}

export default Doodle;