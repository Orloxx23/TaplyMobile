import { Avatar, Card, Icon, Spinner, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function CardFriend({ friend, invited, action }) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const playAction = () => {
    if (invited) return;
    action(friend);
  };

  useEffect(() => {
    (async () => {
      if (!friend) return;
      if (!playerInfo) {
        setLoading(true);
      }
      try {
        await fetch(
          `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${friend.puuid}`
        )
          .then((response) => response.json())
          .then((data) => {
            setPlayerInfo(data.data);
          });
        setLoading(false);
      } catch (error) {
        console.log("🚀 ~ file: HomePlayerCard.jsx:20 ~ error:", error);
      }
    })();
  }, [friend]);

  return (
    <>
      {!loading ? (
        <Card appearance="outline" onPress={playAction}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <View style={{ width: "30%" }}>
              <Avatar
                shape="square"
                source={{ uri: playerInfo?.card?.small }}
                style={{ width: 52, height: 52 }}
              />
            </View>
            <View style={{ width: "60%" }}>
              <Text>{`${playerInfo?.name} #${playerInfo?.tag}`}</Text>
            </View>
            <View style={{ width: "10%" }}>
              {invited ? (
                <Icon
                  fill="#8F9BB3"
                  name="checkmark-circle-outline"
                  style={{ width: 16, height: 16 }}
                />
              ) : (
                <Icon
                  fill="#8F9BB3"
                  name="plus-outline"
                  style={{ width: 16, height: 16 }}
                />
              )}
            </View>
          </View>
        </Card>
      ) : (
        <Card>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </View>
        </Card>
      )}
    </>
  );
}
