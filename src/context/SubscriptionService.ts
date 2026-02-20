import apiClient from "./apiClient";

const getSubscriptionPlans = () => {
  return apiClient.get("/getSubscriptionPlans");
};

export default {
  getSubscriptionPlans,
};