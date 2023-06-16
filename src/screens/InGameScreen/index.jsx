import { Layout } from "@ui-kitten/components";
import React, { useContext, useEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { MainContext } from "../../context/MainContext";

export default function InGameScreen() {
  const { matchMap, scoreMatch } = useContext(MainContext);

  const FROM_COLOR = "#ffffff";
  const TO_COLOR = "rgb(14,25,34)";

  /*useEffect(() => {
    console.log("\nmatchMap", matchMap);
    console.log("\nscoreMatch", scoreMatch);
  }, [matchMap, scoreMatch]);*/

  return (
    <>
      <SafeAreaView
        style={{ padding: 20, backgroundColor: "#0E1922", minHeight: "100%" }}
      >
        <Layout
          style={{
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <View
            style={{
              borderRadius: 15,
              overflow: "hidden",
              width: "100%",
              height: "25%",
              backgroundColor: "transparent",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={{ uri: scoreMatch?.map?.splash }}
              style={{
                width: "125%",
                height: "125%",
                objectFit: "cover",
                marginTop: "-25%",
                marginLeft: "-25%",
              }}
              resizeMode="cover"
            ></ImageBackground>
            <Svg
              width={"100%"}
              style={{
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="90%">
                  <Stop stopOpacity={0.0} offset="0" stopColor={FROM_COLOR} />
                  <Stop stopOpacity={1} offset="1" stopColor={TO_COLOR} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>

            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontWeight: "bold",
                position: "absolute",
                zIndex: 2,
              }}
            >
              {scoreMatch?.map?.displayName || "Jett revive me"}
            </Text>
          </View>

          <Layout
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "12.5%",
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#919A98",
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  zIndex: 2,
                  color: "white",
                }}
              >
                {scoreMatch?.allyTeam || 0}
              </Text>
              <View
                style={{
                  width: "100%",
                  // Todo: Cambiar el 10% por el porcentaje de las rondas ganadas
                  height: "10%",
                  backgroundColor: "#52C8A5",
                  position: "absolute",
                  bottom: 0,
                }}
              ></View>
            </View>

            <View
              style={{
                backgroundColor: "#919A98",
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  zIndex: 2,
                  color: "white",
                }}
              >
                {scoreMatch?.enemyTeam || 0}
              </Text>
              <View
                style={{
                  width: "100%",
                  // Todo: Cambiar el 10% por el porcentaje de las rondas ganadas
                  height: "10%",
                  backgroundColor: "#DE5C58",
                  position: "absolute",
                  bottom: 0,
                }}
              ></View>
            </View>
          </Layout>

          <Layout
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "59.5%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "400", fontSize: 28, color: "white" }}>
              Match in progress
            </Text>
          </Layout>
        </Layout>
      </SafeAreaView>
    </>
  );
}
