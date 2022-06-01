export const makeEvent = (instance) => ({
  getSelfEventData() {
    return instance.get("/events/self");
  },
  getAllEventData() {
    return instance.get("/events");
  },
  addOneEvent({event_name, reward, invite_start, invite_end, event_start, event_end}) {
    return instance.post("/events", {event_name, reward, invite_start, invite_end, event_start, event_end});
  },
  getEventDataById(id) {
    return instance.get(`/events/${id}`);
  },
  updateEventDataById(id, data) {
    return instance.patch(`/events/${id}`, data);
  },
  deleteOne(id) {
      return instance.delete(`/events/${id}`);
  }
});