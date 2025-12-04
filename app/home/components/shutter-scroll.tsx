// app/components/ShutterScroll.tsx
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Props = {
  onPress: (mode: string) => void;
  className?: string;
};

export default function ShutterScroll({ onPress, className }: Props) {
  const shutterButtons = [
    { id: "normal", icon: "circle", size: 60 },
    { id: "people", icon: "user-group", size: 50 },
    { id: "food", icon: "bowl-food", size: 60 },
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
          onPress={() => handleSelect(item.id)}
        >
          <FontAwesome6
            name={item.icon}
            size={item.size}
            color={selected === item.id ? "red" : "black"}
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
