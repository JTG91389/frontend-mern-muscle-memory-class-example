import React, { useEffect, useState } from 'react';
import './doodle.css';

const DoodleControls = (props) => {
    const { versions, setVersion, currentVersion, handleSubmit} = props;

    const handleSelectChange = (e) => {
        setVersion(e.target.value);
    }

    const renderOptions = () => {
        if (Object.keys(versions).length > 0) {
            return Object.keys(versions).map((versionKey) => <option value={versionKey}>Version {versionKey}</option>)
        } else {
            return <option>none</option>
        }
    }

    return (
        <div className="doodle-controls">
            <select onChange={handleSelectChange} value={currentVersion}>
                {renderOptions()}
            </select>
            <span> Changes are changed as soon as you click on a pixel</span>
        </div>
    )
}

export default DoodleControls;