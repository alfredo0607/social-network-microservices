import jwt from "jwt-simple";
import moment from "moment";
import { SECRET_KEY_JWT } from "../config.js";

export const CreateTokenUser = (user) => {
  let date = moment().locale("es");
  let expiredAt = date.add(420, "minutes").unix();

  const payload = {
    user,
    createdAt: moment().locale("es").unix(),
    expiredAt: expiredAt,
  };

  return {
    token: jwt.encode(payload, SECRET_KEY_JWT),
    timeBeforeExpiredAt: date.add(425, "minutes").unix(),
  };
};
