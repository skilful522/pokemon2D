import gameMapJson from "../assets/updatedGameMap.json";

export const getLayer = (layer) =>
  gameMapJson.layers.find(({ name }) => name === layer).data;
