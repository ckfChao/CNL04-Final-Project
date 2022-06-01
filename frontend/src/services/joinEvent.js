export const makeJoinEvent = (instance) => ({
  getJoinEventData() {
    return instance.get("/events/join");
  },
  joinEventByID(id) {
      return instance.patch(`/events/join/${id}`);
  }
});