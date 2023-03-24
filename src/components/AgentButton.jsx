import React, { useContext, useState } from "react";
import { Avatar, Layout, Card } from "@ui-kitten/components";
import { Image, Text, TouchableWithoutFeedback } from "react-native";
import { MainContext } from "../context/MainContext";

export default function AgentButton({
  agent,
  onTap,
  selected,
  locked,
  disabled,
}) {
  const { contracts, playerContracts } = useContext(MainContext);
  const [available, setAvailable] = useState(false);

  const handleClick = () => {
    if (locked || !available || disabled) return;
    onTap();
  };

  React.useEffect(() => {
    if (!playerContracts) return;
    if (!agent) return;
    if (!contracts) return;

    const agentContract = contracts.find(
      (contract) => contract.content.relationUuid === agent.uuid
    );

    if (
      !agentContract ||
      agentContract === undefined ||
      agentContract === "undefined"
    )
      return;

    const playerContract = playerContracts.Contracts.find(
      (contract) => contract.ContractDefinitionID === agentContract.uuid
    );

    if (playerContract.ProgressionLevelReached >= 5) {
      setAvailable(true);
    } else {
      if (
        agentContract.uuid === "e13d0f6f-5727-43bc-af9e-56c10cdb7176" ||
        agentContract.uuid === "c9d1c451-12fc-4601-a97c-8258765fb90d" ||
        agentContract.uuid === "ace2bb52-de25-45b5-8e11-3dd2088f914d" ||
        agentContract.uuid === "3051fb18-9240-4bf3-a9f5-eb9ae954cd9d" ||
        agentContract.uuid === "62b5521c-93f6-4178-aadd-043ed25ed21a"
      ) {
        setAvailable(true);
        return;
      }

      setAvailable(false);
    }
  }, [contracts, agent]);

  return (
    <Card
      style={{
        margin: 5,
        width: 52,
        height: 52,
        display: "flex",
        opacity: locked ? 0.4 : available ? 1 : 0.1,
      }}
      status={selected ? "primary" : "basic"}
      onPress={handleClick}
    >
      <Layout
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          size="giant"
          shape="rounded"
          source={{ uri: agent.displayIcon }}
        />
      </Layout>
    </Card>
  );
}
