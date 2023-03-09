import React from "react";
import { Avatar, Layout, Card } from "@ui-kitten/components";
import { Image, Text, TouchableWithoutFeedback } from "react-native";

export default function AgentButton({ agent, onTap }) {
    
  const handleClick = () => {
    onTap();
  };

  return (
    <Card
      style={{
        margin: 5,
        width: 52,
        height: 52,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={handleClick}
    >
      <Avatar
        size="giant"
        shape="rounded"
        source={{ uri: agent.displayIcon }}
      />
    </Card>
  );
}
