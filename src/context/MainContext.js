import React, { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";

const socket = io("http://192.168.20.21:3000/");

const MainContext = createContext();

function MainProvider({ children }) {
  const navigation = useNavigation();
  const [agents, setAgents] = useState([]);
  const [maps, setMaps] = useState([]);
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
  const [conected, setConected] = useState(false);
  const [searchingMatch, setSearchingMatch] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [matchId, setMatchId] = useState(null);

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
          const agentFilter = agentsSort.filter(
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
    if (!party) return;
    if (party.length === 0 || puuid.length === 0) return;
    const partyMembers = party.Members.map((member) => member.Subject).filter(
      (member) => member !== puuid
    );
    const me = party.Members.find((member) => member.Subject === puuid);
    if (party.State === "MATCHMAKING") {
      setSearchingMatch(true);
    } else {
      setSearchingMatch(false);
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
      setMatchData(data.pregame);
      // console.log("preGameEvent", data.preGameId);
      if (searchingMatch) {
        setSearchingMatch(false);
      }
      if (data.preGameId === undefined || data.preGameId === "undefined") {
        socket.emit("isInGame");
        return;
      }

      if (navigation.getCurrentRoute().name === "PreGame") return;
      navigation.navigate("PreGame");
    });
  }, []);

  useEffect(() => {
    socket.on("inGame", (data) => {
      // console.log("inGame", data);
      if (data || data !== null) {
        // navigation.navigate("InGame");
        setMatchId(data);
        console.log("La partida ya ha comenzado");
        navigation.navigate("Home");
      } else {
        console.log("La partida no ha comenzado");
        navigation.navigate("Home");
      }
    });
  }, []);

  useEffect(() => {
    socket.on("playerContracts", (data) => {
      setPlayerContracts(data);
    });
  }, []);

  const updateData = () => {
    socket.emit("updateData");
  };

  return (
    <MainContext.Provider
      value={{
        socket,
        status,
        messages,
        puuid,
        gameModes,
        party,
        partyMembers,
        me,
        conected,
        updateData,
        searchingMatch,
        setSearchingMatch,
        navigation,
        matchData,
        matchId,
        maps,
        agents,
        playerCards,
        contracts,
        playerContracts
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export { MainContext, MainProvider };
