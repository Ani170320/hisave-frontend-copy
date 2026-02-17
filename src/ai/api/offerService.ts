import apiClient from "./apiClient";



export const getHSBOffers = async (payload: any) => {
  try {
    const response = await apiClient.post("/retrieveHSBOffers", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching HSB Offers:", error);
    throw error;
  }
};



export const getOfferDetails = async (offerId: string) => {
  try {
    const response = await apiClient.get(`/offerDetails/${offerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Offer Details:", error);
    throw error;
  }
};