import apiClient from "./apiClient";

/*
  This calls:
  https://jmiazr2sjf.ap-south-1.awsapprunner.com/retrieveHSBOffers

  But through proxy it becomes:
  /api/retrieveHSBOffers
*/

export const getHSBOffers = async (payload: any) => {
  try {
    const response = await apiClient.post("/retrieveHSBOffers", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching HSB Offers:", error);
    throw error;
  }
};

/*
  Optional: If AI has other offer endpoints,
  add them here in the same pattern.
*/

export const getOfferDetails = async (offerId: string) => {
  try {
    const response = await apiClient.get(`/offerDetails/${offerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Offer Details:", error);
    throw error;
  }
};