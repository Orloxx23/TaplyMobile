import { Icon } from "@ui-kitten/components";
import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { MainContext } from "../context/MainContext";

export default function ConnectionStatus({ ip }) {
  const { checkConnection } = useContext(MainContext);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (status !== null) return;
    const intervalId = setInterval(async () => {
      if (status !== null) return;
      const connected = await checkConnection(ip);
      setStatus(connected);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [ip]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Icon
        style={{ width: 25, height: 25 }}
        fill={status ? "#80eb34" : "#eb3434"}
        name={status ? "checkmark-circle-outline" : "close-circle-outline"}
      />
      <Text
        style={{
          color: status ? "#80eb34" : "#eb3434",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {status ? "Available" : "Unavailable"}
      </Text>
    </View>
  );
}
