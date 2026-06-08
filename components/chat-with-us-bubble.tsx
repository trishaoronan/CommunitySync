import { useRouter } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ImageStyle,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from "react-native";

type Props = {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export function ChatWithUsBubble({
  onPress,
  containerStyle,
  buttonStyle,
  labelStyle,
  imageStyle,
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push("/chat-with-azmo");
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Chat with us"
    >
      <View style={[styles.circleButton, buttonStyle]}>
        <Image
          source={require("@/assets/pics/chatbot.png")}
          style={[styles.iconImage, imageStyle]}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.label, labelStyle]}>Chat with us</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
