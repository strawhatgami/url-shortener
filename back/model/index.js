import User from "./user.js";
import URLMap from "./urlmap.js";

export { default as sequelize } from "./connection.js";
export { default as User } from "./user.js";
export { default as URLMap } from "./urlmap.js";

export const models = { User, URLMap };
