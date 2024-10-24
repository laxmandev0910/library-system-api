/**
 * Module: JwtService
 * Info: Use for handling JWT related methods
 **/

// Import Module dependencies.
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT } = require("../config/api.config");

class JwtService {
  static async signAccessToken(payload) {
    return jwt.sign(payload, JWT.TOKEN_SECRET, {
      expiresIn: JWT.TOKEN_EXPIRE,
    });
  }

  static async signRefreshToken(payload) {
    return jwt.sign(payload, JWT.REFRESH_SECRET, {
      expiresIn: JWT.REFRESH_EXPIRE,
    });
  }

  static async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, JWT.REFRESH_SECRET);
  }

  static async verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, JWT.TOKEN_SECRET);
  }

  static async generateSalt() {
    return crypto.randomBytes(64).toString("hex");
  }
}

module.exports = JwtService;
