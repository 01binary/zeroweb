import { useCallback, useState } from 'react';
import { lightTheme, darkTheme } from '../components/GlobalStyle';

interface ITheme {
    dark: boolean,
    theme: any,
    setTheme: (dark: boolean) => void
};

const useTheme = (): ITheme => {
    const [ isDark, setDark ] = useState<boolean>(false);
    const setTheme = useCallback((dark: boolean) => setDark(dark), []);
    return {
        dark: isDark,
        theme: isDark ? darkTheme : lightTheme,
        setTheme
    };
};

export default useTheme;
