import React, { Component } from "react";
import * as Font from "expo-font";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Fontisto } from "react-native-vector-icons";
import { Icon } from "galio-framework";
import { Dimensions } from "react-native";

export default function IconExtra({ name, family, ...rest }) {
  switch (family) {
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={name} {...rest} />;
    case "MaterialIcons":
      return <MaterialIcons name={name} {...rest} />;
    case "FontAwesome":
      return <FontAwesome name={name} {...rest} />;
    default:
      return null;
  }
}
