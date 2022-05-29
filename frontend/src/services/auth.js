export const makeAuth = (instance) => ({
  login({ username, password, character }) {
    return instance.post("/login", { username, password, character  });
  },
  signUp({username, password, character }) {
    return instance.post("/createUser", {username, password, character });
  },
  validSession() {
    return instance.get("/session");
  },
});
