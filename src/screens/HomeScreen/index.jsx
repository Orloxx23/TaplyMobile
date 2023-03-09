import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import io from "socket.io-client";
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

const socket = io("http://192.168.20.21:3000/");

export default function HomeScreen({ navigation }) {
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [puuid, setPuuid] = useState("");
  const [gameModes, setGameModes] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [party, setParty] = useState([]);
  const [partyMembers, setPartyMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [checked, setChecked] = React.useState(false);
  const [conected, setConected] = useState(false);

  const [searchingMatch, setSearchingMatch] = useState(false);

  useEffect(() => {
    socket.on("console", (data) => {
      setStatus(data);
    });
  }, []);

  useEffect(() => {
    socket.on("puuid", (data) => {
      setPuuid(data);
    });
  }, []);

  useEffect(() => {
    socket.on("gamemodes", (data) => {
      setGameModes(data);
    });
  }, []);

  useEffect(() => {
    socket.on("party", (data) => {
      setParty(data);
    });
  }, []);

  useEffect(() => {
    if (party.length === 0 || puuid.length === 0) return;
    const partyMembers = party.Members.map((member) => member.Subject).filter(
      (member) => member !== puuid
    );
    const me = party.Members.find((member) => member.Subject === puuid);

    const queue = party.MatchmakingData.QueueID;
    for (let i = 0; i < gameModes.length; i++) {
      if (gameModes[i].includes(queue)) {
        setSelectedIndex(new IndexPath(i));
      }
    }

    if (party.Accessibility === "open" || party.Accessibility === "OPEN") {
      setChecked(true);
    } else {
      setChecked(false);
    }

    setPartyMembers(partyMembers);
    setMe(me.Subject);
  }, [party]);

  useEffect(() => {
    socket.on("connected", () => {
      setConected(true);
    });
  }, []);

  useEffect(() => {
    socket.on("disconnected", () => {
      setConected(false);
    });
  }, []);

  useEffect(() => {
    socket.on("updateData", () => {
      updateData();
    });
  }, []);

  useEffect(() => {
    socket.on("preGameEvent", (data) => {
      navigation.navigate("PreGame", { data });
    });
  }, []);

  const updateData = () => {
    socket.emit("updateData");
  };

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
        <Layout style={{ backgroundColor: "#0E1922" }}>
          <Select
            selectedIndex={selectedIndex}
            value={gameModes[selectedIndex.row]}
            onSelect={(index) => changeGameMode(index)}
            style={styles.select}
            disabled={searchingMatch || gameModes.length === 0 || !conected}
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
            disabled={searchingMatch || gameModes.length === 0 || !conected}
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

          {gameModes.length > 0 && (
            <Button
              appearance="outline"
              disabled={gameModes.length === 0 || !conected}
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
