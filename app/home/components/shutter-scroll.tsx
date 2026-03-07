import React, { useRef } from 'react';

import { Dimensions, FlatList, TouchableOpacity, View, Image } from 'react-native';

import { colors } from '../../constants/color';

import type { CameraMode } from '../../types/camera';

type Props = {
  selectedMode: CameraMode;
  onSelectMode: (mode: CameraMode) => void;
  onShutterPress: (mode: CameraMode) => void;
  className?: string;
};

export default function ShutterScroll({
  selectedMode,
  onSelectMode,
  onShutterPress,
  className,
}: Props) {
  const shutterButtons: { id: CameraMode; source: any; size: number }[] = [
    { id: 'normal', source: require('../assets/shutter-circle.png'), size: 80 },
    { id: 'person', source: require('../assets/shutter-people.png'), size: 80 },
    { id: 'food', source: require('../assets/shutter-food.png'), size: 80 },
  ];

  const shutterWidth = 100;
  const shutterSpacing = 20;
  const screenWidth = Dimensions.get('window').width;
  const sideMargin = (screenWidth - shutterWidth) / 2;

  const snapOffsets = shutterButtons.map((_, index) => index * (shutterWidth + shutterSpacing));

  const shutterRef = useRef<FlatList>(null);

  return (
    <FlatList
      className={`${className ?? ''}`}
      data={shutterButtons}
      horizontal
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: sideMargin - shutterSpacing / 2,
        paddingRight: sideMargin - shutterSpacing / 2,
        alignItems: 'center',
      }}
      ItemSeparatorComponent={() => <View style={{ width: shutterSpacing }} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="items-center justify-center"
          style={{ width: shutterWidth }}
          onPress={() => {
            if (item.id === selectedMode) {
              onShutterPress(item.id); // 撮影
            } else {
              onSelectMode(item.id); // モード変更
              const index = shutterButtons.findIndex((b) => b.id === item.id);
              shutterRef.current?.scrollToIndex({ index, animated: true });
            }
          }}
        >
          <Image
            source={item.source}
            style={{
              width: item.size,
              height: item.size,
              tintColor: selectedMode === item.id ? colors.primary : colors.secondary,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      snapToOffsets={snapOffsets}
      decelerationRate="fast"
      getItemLayout={(data, index) => ({
        length: shutterWidth,
        offset: (shutterWidth + shutterSpacing) * index,
        index,
      })}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / (shutterWidth + shutterSpacing),
        );
        onSelectMode(shutterButtons[index].id);
      }}
      ref={shutterRef}
    />
  );
}
