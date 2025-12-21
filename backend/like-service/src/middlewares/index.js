import jwt from "jwt-simple";
import moment from "moment";
import { SECRET_KEY_JWT } from "../config";

export const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: "No se encontró el token de autenticación",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  let payload;
  try {
    payload = jwt.decode(token, SECRET_KEY_JWT);
  } catch (e) {
    return res.status(401).json({
      error: `Token inválido: ${e?.message}`,
    });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.status(401).json({
      error: "El token ha expirado",
    });
  }

  req.user = payload.user;
  next();
};
