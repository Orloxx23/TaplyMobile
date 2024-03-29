import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  BackHandler,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  IndexPath,
  Select,
  SelectItem,
  Button,
  Toggle,
  Text,
  Spinner,
  Card,
  Icon,
  Divider,
} from "@ui-kitten/components";
import { HomePlayerCard } from "../../components";
import { MainContext } from "../../context/MainContext";
import CardFriend from "../../components/CardFriend";
export default function HomeScreen() {
  const {
    socket,
    puuid,
    gameModes,
    me,
    party,
    partyMembers,
    isOwner,
    connected,
    setConnected,
    searchingMatch,
    setSearchingMatch,
    updateData,
    matchId,
    navigation,
    ready,
    friends,
  } = useContext(MainContext);

  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [checked, setChecked] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  const [loading, setLoading] = useState(false);

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [friendsInvited, setFriendsInvited] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", function () {
      socket.disconnect();
      setConnected(false);
      navigation.navigate("Setup");
      return true;
    });
  }, []);

  useEffect(() => {
    if (!party) {
      updateData();
    }
  }, [party]);

  useEffect(() => {
    if (!party) return;
    if (party.length === 0 || puuid.length === 0) return;

    try {
      const queue = party?.MatchmakingData?.QueueID;
      for (let i = 0; i < gameModes.length; i++) {
        if (gameModes[i].includes(queue)) {
          setSelectedIndex(new IndexPath(i));
        }
      }
    } catch (error) {
      console.log("🚀 ~ file: index.jsx:65 ~ useEffect ~ error:", error);
      console.log("party", party);
      console.log("matchmakingdata", party?.MatchmakingData);
      console.log("queue", party?.MatchmakingData?.QueueID);
      // navigation.navigate("Setup");
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
      if (party.State === "MATCHMAKING") {
        setSearchingMatch(true);
        setDisabled(true);
      } else {
        setSearchingMatch(false);
        setDisabled(false);
      }
    }
  }, [matchId]);

  useEffect(() => {
    socket?.emit("isInGame");
  }, []);

  useEffect(() => {
    let intervalo;

    if (corriendo) {
      intervalo = setInterval(() => {
        setSegundos((segundos) => segundos + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [corriendo]);

  useEffect(() => {
    if (searchingMatch) {
      iniciarCronometro();
    } else {
      detenerCronometro();
    }
  }, [searchingMatch]);

  const iniciarCronometro = () => {
    setSegundos(0);
    setCorriendo(true);
  };

  const detenerCronometro = () => {
    setCorriendo(false);
  };

  const changeGameMode = (index) => {
    setSelectedIndex(index);
    socket?.emit("setGamemode", gameModes[index.row]);
  };

  const onCheckedChange = (isChecked) => {
    if (isChecked) {
      socket?.emit("partyAccess", "open");
    } else {
      socket?.emit("partyAccess", "closed");
    }
    setChecked(isChecked);
  };

  const showFriends = () => {
    socket?.emit("getFriends");
    setInviteModalVisible(true);
  };

  const invite = (friend) => {
    const tempFriend = {
      name: friend.game_name,
      tag: friend.game_tag,
    }
    socket?.emit("invite", tempFriend);
    setFriendsInvited([...friendsInvited, friend.puuid]);
    setTimeout(() => {
      setFriendsInvited([])
    }, 10000);
  };

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  const windowHeight = Dimensions.get('screen').height;

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={inviteModalVisible}
        onRequestClose={() => {
          setInviteModalVisible(!inviteModalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000aa",
            position: "relative",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setInviteModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            />
          </TouchableWithoutFeedback>
          <Card disabled={true} style={{ width: "90%", height: "70%" }}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ width: "33%" }} />
              <View style={{ width: "33%" }}>
                <Text
                  category="h5"
                  style={{
                    textAlign: "center",
                  }}
                >
                  INVITE
                </Text>
              </View>
              <View
                style={{
                  width: "33%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  fill="#8F9BB3"
                  name="close-outline"
                  style={{ width: 32, height: 32 }}
                  onPress={() => setInviteModalVisible(false)}
                />
              </View>
            </View>
            <Divider style={{ margin: 15 }} />
            <ScrollView
              style={{
                height: "80%",
              }}
            >
              <View
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {friends?.length > 0 ? (
                  friends?.map((friend) => (
                    <CardFriend
                      key={friend.puuid + "1"}
                      friend={friend}
                      invited={friendsInvited.includes(friend.puuid)}
                      action={invite}
                    />
                  ))
                ) : (
                  <View />
                )}
              </View>
            </ScrollView>
          </Card>
        </View>
      </Modal>
      <SafeAreaView
        style={{ padding: 20, backgroundColor: "#0E1922", minHeight: windowHeight, height: "100%" }}
      >
        <ScrollView>
          <Layout
            style={{
              backgroundColor: "#00000000",
              display: "flex",
              flexDirection: "column",
              height: windowHeight/1.18,
            }}
          >
            <Layout
              style={{
                backgroundColor: "#00000000",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Select
                selectedIndex={selectedIndex}
                value={gameModes[selectedIndex.row]}
                onSelect={(index) => changeGameMode(index)}
                style={styles.select}
                disabled={
                  !isOwner ||
                  searchingMatch ||
                  gameModes.length === 0 ||
                  !connected ||
                  disabled
                }
              >
                {gameModes.length > 0 &&
                  gameModes.map((gameMode) => (
                    <SelectItem
                      style={{ textTransform: "capitalize" }}
                      title={gameMode}
                      key={gameMode}
                    />
                  ))}
              </Select>

              <Toggle
                checked={checked}
                onChange={onCheckedChange}
                style={{ flex: 1 }}
                disabled={
                  !isOwner ||
                  searchingMatch ||
                  gameModes.length === 0 ||
                  !connected ||
                  disabled
                }
              >
                {checked ? `OPEN PARTY` : `CLOSED PARTY`}
              </Toggle>
            </Layout>

            {/* {status && <Text style={{ marginTop: 5 }}>Estado: {status}</Text>}
          {messages.length > 0 &&
          messages.map((message, index) => (
            <Text key={index} style={{ marginTop: 5 }}>
              {message}
            </Text>
          ))} */}

            <Layout style={{ marginTop: 20, backgroundColor: "#0E1922" }}>
              {me && <HomePlayerCard member={me} />}
              {partyMembers.length > 0 &&
                partyMembers.map((member) => (
                  <HomePlayerCard key={member} member={member} />
                ))}
            </Layout>

            {partyMembers.length < 4 && (
              <Button appearance="ghost" onPress={showFriends}>
                Invite
              </Button>
            )}

            <Layout style={{ backgroundColor: "#00000000", flex: 1 }}></Layout>

            {/*matchId && <Button>Enter the game</Button>*/}

            {gameModes.length > 0 && isOwner === true && (
              <Button
                appearance="outline"
                disabled={
                  !isOwner ||
                  gameModes.length === 0 ||
                  !connected ||
                  disabled ||
                  !ready
                }
                style={{ marginTop: 10, color: "white" }}
                onPress={() => {
                  socket?.emit(searchingMatch ? "stopQueue" : "startQueue");
                  setSearchingMatch(!searchingMatch);
                }}
              >
                {searchingMatch
                  ? searchingMatch
                    ? `${minutos
                        .toString()
                        .padStart(2, "0")}:${segundosRestantes
                        .toString()
                        .padStart(2, "0")}`
                    : "InMatch"
                  : "START"}
              </Button>
            )}

            {isOwner === false && (
              <Button
                appearance="outline"
                onPress={() => {
                  setLoading(true);
                  socket?.emit("leaveParty");
                  setTimeout(() => {
                    setLoading(false);
                  }, 10000);
                }}
              >
                {loading ? (
                  <View>
                    <Spinner />
                  </View>
                ) : (
                  "Leave Party"
                )}
              </Button>
            )}
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    textTransform: "capitalize",
    flex: 2,
    display: "flex",
    flexDirection: "column",
  },
});
