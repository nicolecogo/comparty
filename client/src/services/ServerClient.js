class ServerClient {
  // static BASE_URL = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}` || 'http://localhost:3001';
  static _BASE_URL = 'http://localhost:3001';
  static _LOGIN_URL = `${this._BASE_URL}/login`;
}

export default ServerClient;