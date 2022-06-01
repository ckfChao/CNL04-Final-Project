export const makeReward = (instance) => ({
  getReward() {
    return instance.get("/reward");
  }
});