import React from 'react';
import { ImageBackground, StyleSheet, View, TouchableWithoutFeedback, Keyboard, ViewStyle } from 'react-native';
import { useAppTheme } from "../../shared/theme/theme";

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
    const theme = useAppTheme();
    const { spacing, dark } = theme;
    const backgroundImage = dark
        ? require('../assets/background-dark.jpg')
        : require('../assets/background.jpg');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={backgroundImage}
                style={styles.background}
                resizeMode="cover">
                <View //Comes to every screen when using <ScreenWrapper>, think as "universal view"
                    style={[{
                        flex: 1,
                        padding: spacing.large,
                        backgroundColor: 'rgba(70, 130, 180, 0.4)', // fallback
                    },
                        style //Allows passing stuff from single screens for specific style options.
                    ]}
                >
                    {children /*Renders everything and anything else that's put inside <ScreenWrapper>*/}
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
});