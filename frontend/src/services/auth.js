export const makeAuth = (instance) => ({
  login({ username, password, character }) {
    return instance.post("/login", { username, password, character  });
  },
  signUp({username, password, character }) {
    return instance.post("/signup", {username, password, character });
  },
  validSession() {
    return instance.get("/session");
  },
});
