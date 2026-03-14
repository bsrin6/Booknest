import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface BookNestLogoProps {
    size?: number;
    color?: string;
    showCircle?: boolean;
}

export default function BookNestLogo({
    size = 64,
    color = '#2196F3',
    showCircle = true,
}: BookNestLogoProps) {
    const iconSize = showCircle ? size * 0.5 : size;

    return (
        <View
            style={
                showCircle
                    ? {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: '#E8F4FD',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                    : {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
            }
        >
            <Svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none">
                {/* Open book shape */}
                <G>
                    {/* Left page */}
                    <Path
                        d="M8 12C8 10 10 8 12 8C18 8 26 10 32 16V52C26 46 18 44 12 44C10 44 8 42 8 40V12Z"
                        fill={color}
                        opacity={0.9}
                    />
                    {/* Right page */}
                    <Path
                        d="M56 12C56 10 54 8 52 8C46 8 38 10 32 16V52C38 46 46 44 52 44C54 44 56 42 56 40V12Z"
                        fill={color}
                        opacity={0.7}
                    />
                    {/* Bookmark */}
                    <Path
                        d="M38 8H46V24L42 20L38 24V8Z"
                        fill="#1565C0"
                    />
                    {/* Spine highlight */}
                    <Path
                        d="M31 16V52H33V16H31Z"
                        fill="white"
                        opacity={0.3}
                    />
                </G>
            </Svg>
        </View>
    );
}
