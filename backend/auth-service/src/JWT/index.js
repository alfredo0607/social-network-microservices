import { SECRET_KEY_JWT } from "../config.js";
import jwt from "jwt-simple";
import moment from "moment";

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

export const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(422).json({
      errores:
        "No se encontro un token, por favor incluir el token de usuario.",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  let payload = {};

  try {
    payload = jwt.decode(token, SECRET_KEY_JWT);
  } catch (e) {
    return res.status(422).json({ errores: "Invalid token", e });
  }

  if (payload.expiredAt < moment().unix()) {
    return res
      .status(422)
      .json({ errores: "El token de usuario ha expirado." });
  }

  req.user = payload.user;

  next();
};
