import {
  Layout,
  Button,
  Modal,
  Card,
  Text,
  Spinner,
} from "@ui-kitten/components";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BackHandler,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import AgentButton from "../../components/AgentButton";
import { MainContext } from "../../context/MainContext";
import TeammateAgent from "../../components/TeammateAgent";

/*const matchData = {
  map: "/Game/Maps/Jam/Jam",
  team: [
    {
      "Subject": "e1473fcc-d817-57e8-8710-6df4781d2805",
      "CharacterID": "5f8d3a7f-467b-97f3-062c-13acf203c006",
      "CharacterSelectionState": "locked",
      "PregamePlayerState": "joined",
      "CompetitiveTier": 0,
      "PlayerIdentity": {
        "Subject": "e1473fcc-d817-57e8-8710-6df4781d2805",
        "PlayerCardID": "b06a92e4-48ab-81f5-244b-9987534a8603",
        "PlayerTitleID": "d67cef9b-43cd-bc8c-840d-039582975c2a",
        "AccountLevel": 392,
        "PreferredLevelBorderID": "6c1fb61e-46e5-2908-5048-d4866cb64c3d",
        "Incognito": true,
        "HideAccountLevel": false
      },
      "SeasonalBadgeInfo": {
        "SeasonID": "",
        "NumberOfWins": 0,
        "WinsByTier": null,
        "Rank": 0,
        "LeaderboardRank": 0
      },
      "IsCaptain": false
    },
    {
      "Subject": "80496c76-e00c-5412-a5f4-ee4fa816762d",
      "CharacterID": "e370fa57-4757-3604-3648-499e1f642d3f",
      "CharacterSelectionState": "locked",
      "PregamePlayerState": "joined",
      "CompetitiveTier": 0,
      "PlayerIdentity": {
        "Subject": "80496c76-e00c-5412-a5f4-ee4fa816762d",
        "PlayerCardID": "b06a92e4-48ab-81f5-244b-9987534a8603",
        "PlayerTitleID": "eab22308-45da-2059-c14f-44b4c52237b1",
        "AccountLevel": 320,
        "PreferredLevelBorderID": "bd1082ab-462c-3fb8-e049-28a9750acf0f",
        "Incognito": false,
        "HideAccountLevel": true
      },
      "SeasonalBadgeInfo": {
        "SeasonID": "",
        "NumberOfWins": 0,
        "WinsByTier": null,
        "Rank": 0,
        "LeaderboardRank": 0
      },
      "IsCaptain": false
    },
    {
      "Subject": "f4f9b7cc-3c13-5e72-bce0-3dc450082909",
      "CharacterID": "f94c3b30-42be-e959-889c-5aa313dba261",
      "CharacterSelectionState": "selected",
      "PregamePlayerState": "joined",
      "CompetitiveTier": 0,
      "PlayerIdentity": {
        "Subject": "f4f9b7cc-3c13-5e72-bce0-3dc450082909",
        "PlayerCardID": "9ef2f845-4ab5-2350-ea38-0795bb21ed05",
        "PlayerTitleID": "bf097526-4503-6b17-2859-49a67bde66d2",
        "AccountLevel": 240,
        "PreferredLevelBorderID": "547ac9dd-495d-f11d-d921-3fbd14604ae0",
        "Incognito": false,
        "HideAccountLevel": true
      },
      "SeasonalBadgeInfo": {
        "SeasonID": "",
        "NumberOfWins": 0,
        "WinsByTier": null,
        "Rank": 0,
        "LeaderboardRank": 0
      },
      "IsCaptain": false
    },
    {
      "Subject": "2c957d0d-ecc8-5554-8ea7-b9a124042364",
      "CharacterID": "6f2a04ca-43e0-be17-7f36-b3908627744d",
      "CharacterSelectionState": "locked",
      "PregamePlayerState": "joined",
      "CompetitiveTier": 0,
      "PlayerIdentity": {
        "Subject": "2c957d0d-ecc8-5554-8ea7-b9a124042364",
        "PlayerCardID": "bc5312cc-417c-99cd-2b65-fe8ada60950b",
        "PlayerTitleID": "189f8454-45f8-0a74-4b25-77aae468ac02",
        "AccountLevel": 59,
        "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
        "Incognito": false,
        "HideAccountLevel": false
      },
      "SeasonalBadgeInfo": {
        "SeasonID": "",
        "NumberOfWins": 0,
        "WinsByTier": null,
        "Rank": 0,
        "LeaderboardRank": 0
      },
      "IsCaptain": false
    },
    {
      "Subject": "7dbf1894-976b-53be-a720-f40e0fae520d",
      "CharacterID": "569fdd95-4d10-43ab-ca70-79becc718b46",
      "CharacterSelectionState": "locked",
      "PregamePlayerState": "joined",
      "CompetitiveTier": 0,
      "PlayerIdentity": {
        "Subject": "7dbf1894-976b-53be-a720-f40e0fae520d",
        "PlayerCardID": "9fb348bc-41a0-91ad-8a3e-818035c4e561",
        "PlayerTitleID": "d13e579c-435e-44d4-cec2-6eae5a3c5ed4",
        "AccountLevel": 3,
        "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
        "Incognito": false,
        "HideAccountLevel": false
      },
      "SeasonalBadgeInfo": {
        "SeasonID": "",
        "NumberOfWins": 0,
        "WinsByTier": null,
        "Rank": 0,
        "LeaderboardRank": 0
      },
      "IsCaptain": false
    }
  ],
  queue: "spikerush"
}*/

const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

export default function PreGameScreen() {
  const { socket, matchData, me, agents, matchMap } = useContext(MainContext);
  const [agentSelected, setAgentSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [gamemode, setGamemode] = useState(null);
  const [lockedAgents, setLockedAgents] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [mySelection, setMySelection] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", function () {
      return true;
    });
  }, []);

  useEffect(() => {
    if (!matchData) return;
    switch (matchData.queue) {
      case "ggteam":
        setGamemode("Escalation");
        break;
      case "spikerush":
        setGamemode("Spike Rush");
        break;
      default:
        setGamemode(matchData.queue);
    }
  }, [matchData]);

  useEffect(() => {
    if (!matchData) return;

    const tempLockedPlayers = matchData.team?.filter(
      (player) => player.CharacterSelectionState === "locked"
    );
    const tempLockedAgents = tempLockedPlayers?.map(
      (player) => player.CharacterID
    );

    const tempMySelection = matchData.team?.find(
      (player) => player.Subject === me
    );

    if (tempMySelection?.CharacterID) {
      setAgentSelected(tempMySelection.CharacterID);
    }

    setLockedAgents(tempLockedAgents);
  }, [matchData]);

  const selectAgent = (agent) => {
    setAgentSelected(agent);
    socket?.emit("selectAgent", agent);
  };

  const lockAgent = () => {
    if (!agentSelected) return;
    setDisabled(true);
    socket?.emit("lockAgent", agentSelected);
  };

  const openModal = () => {
    setVisible(true);
  };

  const dodge = () => {
    setLoading(true);
    socket?.emit("dodge");
  };

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text
            style={{
              marginBottom: 40,
              marginTop: 20,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Do you want to exit this game?
          </Text>
          {loading ? (
            <Button
              disabled={loading}
              style={{ marginBottom: 10 }}
              accessoryLeft={LoadingIndicator}
            ></Button>
          ) : (
            <Button
              disabled={loading}
              style={{ marginBottom: 10 }}
              onPress={dodge}
            >
              Yes
            </Button>
          )}
          <Button onPress={() => setVisible(false)} appearance="ghost">
            Cancel
          </Button>
        </Card>
      </Modal>

      <SafeAreaView
        style={{ padding: 20, backgroundColor: "#0E1922", minHeight: "100%" }}
      >
        <Layout
          style={{
            width: "100%",
            minHeight: 100,
            marginBottom: 20,
            flex: 1,
          }}
        >
          {matchMap ? (
            <ImageBackground
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
              }}
              resizeMode="cover"
              source={{ uri: matchMap.listViewIcon }}
            >
              <Layout
                style={{
                  backgroundColor: "#0000009f",
                  width: "60%",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: 28,
                    textTransform: "uppercase",
                  }}
                >
                  {matchMap.displayName}
                </Text>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: 18,
                    textTransform: "capitalize",
                  }}
                >
                  {gamemode}
                </Text>
                <Layout
                  style={{ flex: 1, backgroundColor: "#00000000" }}
                ></Layout>
                <Layout
                  style={{
                    backgroundColor: "#00000000",
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  {matchData &&
                    matchData.team
                      ?.filter((player) => player.Subject !== me)
                      ?.map((player) => (
                        <TeammateAgent key={player.Subject} player={player} />
                      ))}
                </Layout>
              </Layout>
              <Layout
                style={{
                  width: "40%",
                  height: "100%",
                  backgroundColor: "#0000009f",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: "250%",
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                  source={{
                    uri:
                      agentSelected &&
                      agents.find((agent) => agent.uuid === agentSelected)
                        .bustPortrait,
                  }}
                />
              </Layout>
            </ImageBackground>
          ) : (
            <Layout
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Layout>
                <Spinner size="giant" />
              </Layout>
            </Layout>
          )}
        </Layout>

        <Layout
          style={{
            display: "flex",
            maxWidth: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            minHeight: 60,
          }}
        >
          {agents?.length > 0 ? (
            agents.map((agent) => (
              <AgentButton
                key={agent.uuid}
                agent={agent}
                onTap={() => selectAgent(agent.uuid)}
                selected={agentSelected === agent.uuid}
                locked={lockedAgents?.includes(agent.uuid)}
                disabled={disabled}
              />
            ))
          ) : (
            <Layout
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner size="giant" />
            </Layout>
          )}
        </Layout>

        <Button
          disabled={!agentSelected || disabled}
          style={{ marginTop: 20 }}
          onPress={lockAgent}
        >
          Lock
        </Button>
        <Button style={{ marginTop: 20 }} onPress={openModal}>
          Dodge
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
