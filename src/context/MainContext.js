import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ToastAndroid } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// const socket = io("http://192.168.20.21:7000/");

const MainContext = createContext();

function MainProvider({ children }) {
  const navigation = useNavigation();
  const [agents, setAgents] = useState([]);
  const [maps, setMaps] = useState([]);
  const [matchMap, setMatchMap] = useState({});
  const [contracts, setContracts] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [playerContracts, setPlayerContracts] = useState(null);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [puuid, setPuuid] = useState("");
  const [gameModes, setGameModes] = useState([]);
  const [party, setParty] = useState([]);
  const [partyMembers, setPartyMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [connected, setConnected] = useState(false);
  const [searchingMatch, setSearchingMatch] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [socket, setSocket] = useState(io({ autoConnect: false }));
  const [socketLoading, setSocketLoading] = useState(false);
  const [socketError, setSocketError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ready, setReady] = useState(false);
  const [friends, setFriends] = useState([]);
  const [scoreMatch, setScoreMatch] = useState({
    allyTeam: 0,
    enemyTeam: 0,
    map: "",
  });

  const requestRef = useRef();
  const timeoutRef = useRef();

  /* PUSH NOTIFICATIONS */
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification(title, body, data) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: { seconds: 2 },
      icon: require("../../assets/favicon.png"),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  /* ------ */

  const cancelAllCallbacks = () => {
    cancelAnimationFrame(requestRef.current);
    clearTimeout(timeoutRef.current);
  };

  const connectToSocket = async (ip) => {
    setSocketLoading(true);
    const newSocket = io(`http://${ip}:7000/`);

    newSocket.on("connect", () => {
      setSocket(newSocket);
      navigation.navigate("Home");
      setConnected(true);
      setSocketLoading(false);
      setSocketError(false);
    });

    newSocket.on("noLockData", () => {
      showToast("The game has not started");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      setSocket(io({ autoConnect: false }));
      setSocketLoading(false);
      setSocketError(false);
      navigation.navigate("Setup");
      cancelAllCallbacks();
    });

    newSocket.on("connect_error", (error) => {
      setSocketError(true);
      console.log("Error al conectar:", error);
      newSocket.disconnect();
      setSocket(io({ autoConnect: false }));

      if (navigation.getCurrentRoute().name !== "Setup") return;
      navigation.navigate("Setup");

      setSocketLoading(false);
    });
  };

  // useEffect(() => {
  //   connectToSocket();
  // }, []);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  useEffect(() => {
    (async () => {
      let url = "https://valorant-api.com/v1/agents";
      let tempAgents = [];
      let options = { method: "GET" };

      await fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          tempAgents = json.data;
          const agentsSort = tempAgents.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName);
          });
          const agentFilter = agentsSort?.filter(
            (agent) => agent.isPlayableCharacter === true
          );
          setAgents(agentFilter);
        })
        .catch((err) => console.error("error:" + err));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let url = "https://valorant-api.com/v1/maps";

      let options = { method: "GET" };

      await fetch(url, options)
        .then((res) => res.json())
        .then((json) => setMaps(json.data))
        .catch((err) => console.error("error:" + err));
    })();
  }, []);

  useEffect(() => {
    if (!maps.length > 0) return;
    const tempMap =
      matchData && maps.find((map) => map.mapUrl === matchData.map);

    setMatchMap(tempMap);
  }, [matchData]);

  useEffect(() => {
    let url = "https://valorant-api.com/v1/playercards";

    let options = { method: "GET" };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setPlayerCards(json.data))
      .catch((err) => console.error("error:" + err));
  }, []);

  useEffect(() => {
    let url = "https://valorant-api.com/v1/contracts";

    let options = { method: "GET" };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setContracts(json.data))
      .catch((err) => console.error("error:" + err));
  }, []);

  useEffect(() => {
    socket?.on("console", (data) => {
      setStatus(data);
    });
  }, []);

  useEffect(() => {
    socket?.on("puuid", (data) => {
      setPuuid(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("gamemodes", (data) => {
      setGameModes(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("party", (data) => {
      setParty(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!party) return;
    if (party.length === 0 || puuid.length === 0) return;

    try {
      const partyMembers = party.Members?.filter(
        (member) => member.Subject !== puuid
      );

      const me = party.Members?.find((member) => member.Subject === puuid);

      if (party.State === "MATCHMAKING") {
        setSearchingMatch(true);
      } else {
        setSearchingMatch(false);
      }

      if ("IsOwner" in me) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      setPartyMembers(partyMembers);
      setMe(me);
    } catch (error) {
      console.log("error", error);
    }
  }, [party, socket]);

  useEffect(() => {
    socket?.on("connected", () => {
      setConnected(true);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("disconnected", () => {
      setConnected(false);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("updateData", () => {
      updateData();
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("preGameEvent", (data) => {
      setMatchData(data.pregame);
      // console.log("preGameEvent", data.preGameId);
      if (searchingMatch) {
        setSearchingMatch(false);
      }
      if (data.preGameId === undefined || data.preGameId === "undefined") {
        cancelAllCallbacks();
        socket?.emit("isInGame");
        return;
      }

      if (navigation.getCurrentRoute().name === "PreGame") return;
      schedulePushNotification("Match found", data.pregame.queue);
      navigation.navigate("PreGame");
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("inGame", (data) => {
      // console.log("inGame", data);
      if (data || data !== null || data !== "null") {
        // navigation.navigate("InGame");
        setMatchId(data);
        // console.log("La partida ya ha comenzado");
        navigation.navigate("InGame");
      } else {
        // console.log("La partida no ha comenzado");
        navigation.navigate("Home");
        setMatchId(null);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("goHome", () => {
      if (navigation.getCurrentRoute().name === "Home") return;
      navigation.navigate("Home");
      setMatchData(null);
      setMatchId(null);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("playerContracts", (data) => {
      setPlayerContracts(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("goInGame", () => {
      if (navigation.getCurrentRoute().name === "InGame") return;
      navigation.navigate("InGame");
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("inGameData", (data) => {
      const inGameMap =
        data && maps.find((map) => map.mapUrl === data.matchMap);
      setScoreMatch({
        allyTeam: data.partyOwnerMatchScoreAllyTeam,
        enemyTeam: data.partyOwnerMatchScoreEnemyTeam,
        map: inGameMap,
      });
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("friends", (data) => {
      setFriends(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("connect_error", (error) => {
      setSocketError(true);
      console.log("Error al conectar:", error);
      socket.disconnect();
      setSocket(io({ autoConnect: false }));
      cancelAllCallbacks();

      navigation.navigate("Setup");

      setSocketLoading(false);
    });
  }, [socket]);

  const updateData = () => {
    socket?.emit("updateData");
  };

  return (
    <MainContext.Provider
      value={{
        socket,
        connectToSocket,
        socketLoading,
        socketError,
        status,
        messages,
        puuid,
        gameModes,
        party,
        partyMembers,
        ready,
        setReady,
        isOwner,
        me,
        connected,
        setConnected,
        updateData,
        searchingMatch,
        setSearchingMatch,
        navigation,
        matchData,
        matchId,
        maps,
        matchMap,
        agents,
        playerCards,
        contracts,
        playerContracts,
        friends,
        scoreMatch,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export { MainContext, MainProvider };
