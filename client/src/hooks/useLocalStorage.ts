import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved) as T;
    }
    return defaultValue;
}

export const useLocalStorage = <T>(
    key: string,
    defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        // Save to local storage whenever 'value' changes
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
