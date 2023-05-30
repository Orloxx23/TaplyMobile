import React, { useContext, useEffect, useState } from "react";
import { Card, Layout, Text, Avatar, Spinner } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { MainContext } from "../context/MainContext";

export default function HomePlayerCard({ member }) {
  const { party, playerCards, setReady } = useContext(MainContext);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playerImg, setPlayerImg] = useState(null);

  useEffect(() => {
    (async () => {
      if (!member) return;
      if (!playerInfo) {
        setLoading(true);
      }
      try {
        await fetch(
          `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${member.Subject}`
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
  }, [member]);

  useEffect(() => {
    if (!member || member === "") return;

    const me = party?.Members?.find((tmpmember) => tmpmember.Subject === member.Subject);
    const meCard = me?.PlayerIdentity.PlayerCardID;

    const img = playerCards?.find((card) => card.uuid === meCard)?.smallArt;
    setPlayerImg(img);
  }, [party, member, loading]);

  useEffect(() => {
    if(!member || member === "") return;

    if(member.IsReady){
      setReady(true);
    } else {
      setReady(false);
    }
  }, [party, member]);

  if (!playerInfo || !member || member === "")
    return (
      <Card style={styles.cardNone} status="primary">
        <Layout style={styles.cardLayoutNone}>
          {/* <Text>Error :c</Text> */}
        </Layout>
      </Card>
    );

  return (
    <Card style={styles.card} status={member.IsReady ? "primary" : "basic"}>
      <Layout style={styles.cardLayout}>
        {loading ? (
          <Layout
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Spinner />
          </Layout>
        ) : (
          <>
            <Text>{playerInfo?.name}</Text>
            <Avatar
              shape="square"
              source={{ uri: playerImg || playerInfo?.card?.small }}
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
    backgroundColor: "#00000000",
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
