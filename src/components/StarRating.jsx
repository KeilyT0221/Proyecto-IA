import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Colors } from "../constants/colors";

export default function StarRating({ value = 0, onChange, size = 24 }) {
  const [pressed, setPressed] = useState(0);

  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => onChange?.(s)}
          onPressIn={() => setPressed(s)}
          onPressOut={() => setPressed(0)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: size,
              color: s <= (pressed || value) ? Colors.gold : "#2a2a45",
            }}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
