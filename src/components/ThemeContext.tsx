import React, { createContext } from 'react';
import { lightTheme } from '../components/GlobalStyle';
import useTheme from '../hooks/useTheme';

interface IThemeContext {
    dark: boolean,
    theme: any,
    setTheme: (dark: boolean) => void
};

export const ThemeContext = createContext<Partial<IThemeContext>>({
    dark: false,
    theme: lightTheme
});

export const ThemeProvider: React.FunctionComponent = ({
    children
}) => {
    const themeProps = useTheme();
    return (
        <ThemeContext.Provider value={themeProps}>
            {children}
        </ThemeContext.Provider>
    )
};
