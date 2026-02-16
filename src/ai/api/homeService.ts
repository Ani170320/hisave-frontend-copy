import apiClient from "./apiClient";

/*
  Fetch AI Home Carousel
  Endpoint:
  /retrieveCarousel
*/

export const getCarousel = async () => {
  try {
    const response = await apiClient.get("/retrieveCarousel");
    return response.data;
  } catch (error) {
    console.error("Error fetching carousel:", error);
    throw error;
  }
};

/*
  Fetch AI Homepage Category Images
  (If used inside AI module)
*/

export const getHomePageCategories = async () => {
  try {
    const response = await apiClient.get("/homePageCategoryImages");
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage categories:", error);
    throw error;
  }
};