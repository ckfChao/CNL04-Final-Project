export const makeInfo = (instance) => ({
  getInfo() {
    return instance.get("/info");
  },
  updateInfo(data) {
    return instance.patch("/info", data);
  }
});
