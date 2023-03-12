import { Avatar, Card, Layout, Spinner } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/MainContext";

export default function TeammateAgent({ player }) {
  const { agents } = useContext(MainContext);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!player || agents.length === 0) return;

    setLoading(true);
    const tempAgent = agents.find((agent) => agent.uuid === player.CharacterID);
    setAgent(tempAgent);
    setState(player.CharacterSelectionState);

    setLoading(false);
  }, [player]);

  return (
    <Card
      style={{
        margin: 1,
        width: 38,
        height: 38,
        display: "flex",
      }}
      appearance="outline"
      status={state && state === "locked" ? "primary" : "basic"}
    >
      <Layout
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#00000000",
          opacity: state && state === "locked" ? 1 : 0.3,
        }}
      >
        {!loading ? (
          <Avatar
            size="small"
            shape="rounded"
            source={{ uri: agent?.displayIcon }}
            style={{ position: "absolute", left: -22, top: -13 }}
          />
        ) : (
          <Layout
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundColor: "#00000000",
              opacity: 0.3,
            }}
          >
            <Spinner size="tiny" />
          </Layout>
        )}
      </Layout>
    </Card>
  );
}
