import React, { useEffect, useState } from "react";
import { Card, Layout, Text, Avatar, Spinner } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

export default function HomePlayerCard({ puuid }) {
  const [playerInfo, setPlayerInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!puuid) return;
      setLoading(true);
      try {
        await fetch(
          `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${puuid}`
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
  }, [puuid]);

  if (!playerInfo || !puuid)
    return (
      <Card style={styles.cardNone} status="primary">
        <Layout style={styles.cardLayoutNone}>
          <Text>Invite +</Text>
        </Layout>
      </Card>
    );

  return (
    <Card style={styles.card} status="primary">
      <Layout style={styles.cardLayout}>
        {loading ? (
          <Layout style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <Spinner />
          </Layout>
        ) : (
          <>
            <Text>{playerInfo?.name}</Text>
            <Avatar
              shape="square"
              source={{ uri: playerInfo?.card?.small }}
              style={{ width: 52, height: 52 }}
            />
          </>
        )}
      </Layout>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    marginBottom: 10,
  },

  cardLayout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLayoutNone: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cardNone: {},
});
