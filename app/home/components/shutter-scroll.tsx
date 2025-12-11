// app/components/ShutterScroll.tsx
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View, Image } from "react-native";
import { colors } from "../../constans/color";

type Props = {
  onPress: (mode: string) => void;
  className?: string;
};

export default function ShutterScroll({ onPress, className }: Props) {
  const shutterButtons = [
    { id: "normal", source: require("../assets/shutter-circle.png"), size: 80 },
    { id: "people", source: require("../assets/shutter-people.png"), size: 80 },
    { id: "food", source: require("../assets/shutter-food.png"), size: 80 },
  ];

  const shutterWidth = 100;
  const shutterSpacing = 20;
  const screenWidth = Dimensions.get("window").width;

  const sideMargin = (screenWidth - shutterWidth) / 2;

  const snapOffsets = shutterButtons.map(
    (_, index) => index * (shutterWidth + shutterSpacing)
  );

  const shutterRef = useRef<FlatList>(null);
  const [selected, setSelected] = useState(shutterButtons[0].id);

  function handleSelect(id: string) {
    setSelected(id);

    const index = shutterButtons.findIndex((b) => b.id === id);
    shutterRef.current?.scrollToIndex({ index, animated: true });

    onPress(id); // ← 親に通知！
  }

  return (
    <FlatList
      className={`bg-white ${className ?? ""}`}
      data={shutterButtons}
      horizontal
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: sideMargin - shutterSpacing / 2,
        paddingRight: sideMargin - shutterSpacing / 2,
        alignItems: "center",
      }}
      ItemSeparatorComponent={() => (
        <View style={{ width: shutterSpacing }} />
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="items-center justify-center"
          style={{ width: shutterWidth }}
          onPress={() => { if (selected === item.id) onPress(item.id); }}
        >
          <Image
            source={item.source}
            style={{
              width: item.size,
              height: item.size,
              tintColor: selected === item.id ? colors.primary : colors.secondary,
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
          event.nativeEvent.contentOffset.x /
            (shutterWidth + shutterSpacing)
        );
        setSelected(shutterButtons[index].id);
      }}
      ref={shutterRef}
    />
  );
}
