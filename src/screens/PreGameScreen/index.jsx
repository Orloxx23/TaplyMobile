import { Text, Layout } from "@ui-kitten/components";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AgentButton from "../../components/AgentButton";
import io from "socket.io-client";

const socket = io("http://192.168.20.21:3000/");

export default function PreGameScreen({ navigation }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    (async () => {
      let url = "https://valorant-api.com/v1/agents";
      let tempAgents = [];
      let options = { method: "GET" };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          tempAgents = json.data;
          const agentsSort = tempAgents.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName);
          });
          const agentFilter = agentsSort.filter(
            (agent) => agent.isPlayableCharacter === true
          );
          setAgents(agentFilter);
        })
        .catch((err) => console.error("error:" + err));
    })();
  }, []);

  useEffect(() => {
    socket.on("goToLobby", () => {
      navigation.navigate("Home");
    });
  }, []);

  const selectAgent = (agent) => {
    socket.emit("selectAgent", agent);
  };

  return (
    <>
      <SafeAreaView
        style={{ padding: 20, backgroundColor: "#0E1922", minHeight: "100%" }}
      >
        <Text>PreGameScreen</Text>
        <Layout
          style={{
            display: "flex",
            maxWidth: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {agents?.map((agent) => (
            <AgentButton key={agent.uuid} agent={agent} onTap={() => selectAgent(agent.uuid)} />
          ))}
        </Layout>
      </SafeAreaView>
    </>
  );
}
