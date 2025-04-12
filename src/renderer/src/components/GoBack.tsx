import React from 'react';

export default function GoBack(): JSX.Element {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="flex flex-row justify-start w-full pl-2 pt-4  items-center">
            <button className='bg-blue-400 rounded-md p-2' onClick={handleGoBack} >
                Go Back
            </button>
        </div>
    );
};

