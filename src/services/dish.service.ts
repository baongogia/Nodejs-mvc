import { Dish } from "../models/dish.model";

export const fetchAllDishes = async () => {
  return await Dish.find({});
};

export const createNewDish = async (dishData: any) => {
  return await Dish.create(dishData);
};
