export const makeInvite = (instance) => ({
  getInvite() {
    return instance.get("/invite");
  },
  addInvite({username, id}) {
    return instance.post("/invite", {username, id});
  },
  accpet(id) {
    return instance.patch(`/invite/${id}`);
  },
  deleteOne(id) {
      return instance.delete(`/invite/${id}`);
  }
});