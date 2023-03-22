import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Icon,
  Text,
  Layout,
  Button,
  Modal,
  Card,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from "../../context/MainContext";
import ConnectionStatus from "../../components/ConnectionStatus";

export default function SetupScreen() {
  const { connectToSocket, socketLoading, socketError, navigation } =
    useContext(MainContext);
  const [connections, setConnections] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [optionsVisible, setOptionsVisible] = React.useState(false);
  const [selectedConnection, setSelectedConnection] = React.useState(null);

  const [name, setName] = React.useState("Connection");
  const [ip, setIp] = React.useState("0.0.0.0");

  useEffect(() => {
    readArrayFromStorage("connections").then((value) => {
      setConnections(value);
    });
  }, []);

  const readArrayFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return [];
      }
    } catch (e) {
      console.log("Error reading array from storage: ", e);
    }
  };

  const saveArrayToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setConnections(value);
      console.log("Array saved successfully");
    } catch (e) {
      console.log("Error saving array: ", e);
    }
  };

  const addConnection = async (key, newValue) => {
    try {
      const existingArray = await readArrayFromStorage(key);
      const updatedArray = [...existingArray, newValue];
      await saveArrayToStorage(key, updatedArray);
      console.log("Value added to array successfully");
    } catch (e) {
      console.log("Error adding value to array: ", e);
    }
  };

  const updateConnection = async (key, id, updatedValues) => {
    try {
      const existingArray = await readArrayFromStorage(key);
      const updatedArray = existingArray.map((obj) => {
        if (obj.id === id) {
          return { ...obj, ...updatedValues };
        } else {
          return obj;
        }
      });
      await saveArrayToStorage(key, updatedArray);
      console.log("Object updated successfully");
    } catch (e) {
      console.log("Error updating object in array: ", e);
    }
  };

  const deleteConnection = async (key, id) => {
    try {
      const existingArray = await readArrayFromStorage(key);
      const updatedArray = existingArray.filter((obj) => obj.id !== id);
      await saveArrayToStorage(key, updatedArray);
      console.log("Object deleted successfully");
    } catch (e) {
      console.log("Error deleting object from array: ", e);
    }
  };

  const createConnection = () => {
    const newConnection = {
      id: Math.random().toString(36),
      name: name,
      ip: ip
    };
    addConnection("connections", newConnection);
    setVisible(false);
  };

  const connect = (ip) => {
    setLoading(true);
    connectToSocket(ip);
  };

  const okError = () => {
    setError(false);
    if (navigation.getCurrentRoute().name !== "Setup") return;
    navigation.navigate("Setup");
  };

  useEffect(() => {
    setLoading(socketLoading);
    if (socketLoading === false) {
      setError(socketError);
    }
  }, [socketLoading, socketError]);

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text style={{ fontWeight: 700, fontSize: 16 }}>
            Add new connection
          </Text>

          <Text style={{ marginTop: 10 }}>Name</Text>
          <Input
            placeholder="Connection"
            onChangeText={(nextValue) => setName(nextValue)}
          />

          <Text style={{ marginTop: 10 }}>Code</Text>
          <Input
            placeholder="0.0.0.0"
            onChangeText={(nextValue) => setIp(nextValue)}
          />
          <Button style={{ marginTop: 20 }} onPress={() => createConnection()}>
            ADD
          </Button>
        </Card>
      </Modal>

      <Modal
        visible={loading}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Card disabled={true}>
          <Spinner />
        </Card>
      </Modal>

      <Modal
        visible={error}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={okError}
      >
        <Card disabled={true}>
          <Text style={{ fontWeight: 700, fontSize: 16 }}>
            Connection error
          </Text>
          <Button onPress={okError}>Accept</Button>
        </Card>
      </Modal>

      <Modal
        visible={optionsVisible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setOptionsVisible(false)}
      >
        <Card disabled={true}>
          <Text style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
            Options
          </Text>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Icon
              style={{ width: 52, height: 52 }}
              name="edit-outline"
              fill="#8F9BB3"
            />
            <Icon
              style={{ width: 52, height: 52 }}
              name="trash-2-outline"
              fill="#8F9BB3"
              onPress={() => {
                deleteConnection("connections", selectedConnection);
                setOptionsVisible(false);
                setSelectedConnection(null);
              }}
            />
          </View>
          <Button
            style={{ marginTop: 20 }}
            onPress={() => setOptionsVisible(false)}
            appearance="outline"
          >
            Cancel
          </Button>
        </Card>
      </Modal>

      <SafeAreaView style={{ backgroundColor: "#0E1922", minHeight: "100%" }}>
        <Layout
          style={{
            backgroundColor: "#0E1922",
            height: "10%",
            width: "100%",
            padding: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
            TAPLY
          </Text>
          <Icon
            style={{ width: 25, height: 25 }}
            fill="#8F9BB3"
            name="plus-square-outline"
            onPress={() => setVisible(true)}
          />
        </Layout>

        <View
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "90%",
            width: "100%",
          }}
        >
          {connections.length > 0 ? (
            <ScrollView>
              {connections.map((connection) => (
                <Card
                  key={connection.id}
                  style={{ width: 500, height: 200, marginBottom: 20 }}
                  status="primary"
                  onPress={() => connect(connection.ip)}
                  onLongPress={() => {
                    setOptionsVisible(true);
                    setSelectedConnection(connection.id);
                  }}
                >
                  <View
                    style={{
                      padding: 20,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <Icon
                      style={{ width: 125, height: 125 }}
                      fill="#8F9BB3"
                      name="monitor-outline"
                    />
                    <View>
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>
                        {connection.name}
                      </Text>
                      <Text style={{ fontWeight: 100, fontSize: 16 }}>
                        {connection.ip}
                      </Text>
                      <ConnectionStatus ip={connection.ip} />
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}></View>
              <Icon
                style={{ width: 75, height: 75 }}
                fill="#8F9BB3"
                name="slash-outline"
              />
              <Text style={{ color: "white", marginTop: 10 }}>
                No connections
              </Text>
              <View style={{ flex: 1 }}></View>
              <Button onPress={() => setVisible(true)} appearance="outline">
                Add new connection
              </Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
