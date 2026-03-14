import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface BookWatermarkProps {
    size?: number;
    color?: string;
    opacity?: number;
    style?: object;
}

export default function BookWatermark({
    size = 80,
    color = '#D6E4F0',
    opacity = 0.4,
    style,
}: BookWatermarkProps) {
    return (
        <View style={[{ width: size, height: size }, style]}>
            <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
                <G opacity={opacity}>
                    {/* Simple open book outline */}
                    <Path
                        d="M8 14C8 12 10 10 12 10C18 10 26 12 32 18V50C26 44 18 42 12 42C10 42 8 40 8 38V14Z"
                        stroke={color}
                        strokeWidth={2}
                        fill="none"
                    />
                    <Path
                        d="M56 14C56 12 54 10 52 10C46 10 38 12 32 18V50C38 44 46 42 52 42C54 42 56 40 56 38V14Z"
                        stroke={color}
                        strokeWidth={2}
                        fill="none"
                    />
                    {/* Bookmark tab */}
                    <Path
                        d="M38 10H46V26L42 22L38 26V10Z"
                        stroke={color}
                        strokeWidth={2}
                        fill="none"
                    />
                </G>
            </Svg>
        </View>
    );
}
