import { StyleSheet, Image } from "react-native";
import registerNNPushToken from "native-notify";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import LoginForm from "@/components/LoginForm";

export default function TabOneScreen() {
  registerNNPushToken(25378, "Vcvb05fe8Oc24pqJmPQmZH");
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/student-icon.png")}
        style={styles.icon}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <LoginForm pageNumber={1} />
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
