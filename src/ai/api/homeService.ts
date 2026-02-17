import apiClient from "./apiClient";



export const getCarousel = async () => {
  try {
    const response = await apiClient.get("/retrieveCarousel");
    return response.data;
  } catch (error) {
    console.error("Error fetching carousel:", error);
    throw error;
  }
};



export const getHomePageCategories = async () => {
  try {
    const response = await apiClient.get("/homePageCategoryImages");
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage categories:", error);
    throw error;
  }
};