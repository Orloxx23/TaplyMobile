import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  IndexPath,
  Select,
  SelectItem,
  Button,
  Toggle,
} from "@ui-kitten/components";
import { HomePlayerCard } from "../../components";
import { MainContext } from "../../context/MainContext";
export default function HomeScreen() {
  const {
    socket,
    puuid,
    gameModes,
    me,
    party,
    partyMembers,
    conected,
    searchingMatch,
    setSearchingMatch,
    updateData,
    matchId,
  } = useContext(MainContext);

  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [checked, setChecked] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  useEffect(() => {
    if (!party) {
      updateData();
    }
  }, [party]);

  useEffect(() => {
    if (!party) return;
    if (party.length === 0 || puuid.length === 0) return;

    try {
      const queue = party.MatchmakingData.QueueID;
      for (let i = 0; i < gameModes.length; i++) {
        if (gameModes[i].includes(queue)) {
          setSelectedIndex(new IndexPath(i));
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (party.Accessibility === "open" || party.Accessibility === "OPEN") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [party]);

  useEffect(() => {
    if (matchId) {
      setDisabled(true);
      setSearchingMatch(false);
    } else {
      setDisabled(false);
    }
  }, [matchId]);

  const changeGameMode = (index) => {
    setSelectedIndex(index);
    socket.emit("setGamemode", gameModes[index.row]);
  };

  const onCheckedChange = (isChecked) => {
    if (isChecked) {
      socket.emit("partyAccess", "open");
    } else {
      socket.emit("partyAccess", "closed");
    }
    setChecked(isChecked);
  };

  return (
    <SafeAreaView
      style={{ padding: 20, backgroundColor: "#0E1922", minHeight: "100%" }}
    >
      <ScrollView>
        <Layout
          style={{
            backgroundColor: "#00000000",
            display: "flex",
            flexDirection: "column",
            height: 600,
          }}
        >
          <Select
            selectedIndex={selectedIndex}
            value={gameModes[selectedIndex.row]}
            onSelect={(index) => changeGameMode(index)}
            style={styles.select}
            disabled={
              searchingMatch || gameModes.length === 0 || !conected || disabled
            }
          >
            {gameModes.length > 0 &&
              gameModes.map((gameMode) => (
                <SelectItem title={gameMode} key={gameMode} />
              ))}
          </Select>

          {/* {status && <Text style={{ marginTop: 5 }}>Estado: {status}</Text>}
          {messages.length > 0 &&
          messages.map((message, index) => (
            <Text key={index} style={{ marginTop: 5 }}>
              {message}
            </Text>
          ))} */}

          <Toggle
            checked={checked}
            onChange={onCheckedChange}
            style={{ marginTop: 20 }}
            disabled={
              searchingMatch || gameModes.length === 0 || !conected || disabled
            }
          >
            {checked ? `OPEN PARTY` : `CLOSED PARTY`}
          </Toggle>

          <Layout style={{ marginTop: 20, backgroundColor: "#0E1922" }}>
            {me ? <HomePlayerCard puuid={me} /> : <HomePlayerCard puuid={""} />}
            {partyMembers.length > 0 ? (
              partyMembers.map((member) => (
                <HomePlayerCard key={member} puuid={member} />
              ))
            ) : (
              <Button disabled>Invitar</Button>
            )}
          </Layout>

          <Layout style={{ backgroundColor: "#00000000", flex: 1 }}></Layout>

          {gameModes.length > 0 && (
            <Button
              appearance="outline"
              disabled={gameModes.length === 0 || !conected || disabled}
              style={{ marginTop: 50, color: "white" }}
              onPress={() => {
                socket.emit(searchingMatch ? "stopQueue" : "startQueue");
                setSearchingMatch(!searchingMatch);
              }}
            >
              {searchingMatch ? "STOP" : "START"}
            </Button>
          )}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  select: {
    textTransform: "capitalize",
  },
});
