const express = require("express");
const { v4: uuidv4 } = require("uuid");
// const { updateRestaurantName } = require("../../frontend/src/api/restaurants");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88333",
    restaurantId: "7f4a4fe2-58eb-4833-9e93-2dfdd1a1d91f",
    comment: "Their lunch special is HORRIFYING!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
   console.log('get all starred rests');
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
 router.get("/:id", (req, res) => {
    console.log('get 1 starred rest');
    const { id } = req.params;

    // Find the restaurant with the matching id.
    const starredRest = STARRED_RESTAURANTS.find((star) => star.id === id);
    if (!starredRest) {
      console.log(`---------- starred ID(${id}) - not found`);
      res.sendStatus(404);
      return;
    }
    const {name} = ALL_RESTAURANTS.find((restaurant) => restaurant.id === starredRest.restaurantId);
    if (!name) {
      console.log(`---------- restaurant ID(${starredRest.restaurantId}) - not found`);
      res.sendStatus(404);
      return;
    }
    const joinedStarredRestaurant = {
      id: starredRest.id,
      comment: starredRest.comment,
      // name:  ALL_RESTAURANTS.find((restaurant) => restaurant.id === starredRest.restaurantId).name,
      name: name,
    };
   
  
  // console.log(JSON.stringify(joinedStarredRestaurant));
  res.json(joinedStarredRestaurant);
 
 });

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
//  router.post("/:id", (req, res) => {
 router.post("/", (req, res) => {
  console.log('add starred rest');
  // console.log(JSON.stringify(req.body));
  // const { id } = req.params;
  const { id } = req.body;

  // Find the restaurant with the matching id.
  const starredRestFound = STARRED_RESTAURANTS.find((star) => star.restaurantId === id);
  if (starredRestFound) {
    console.log(`---------- starred ID(${id}) - already exists`);
    res.sendStatus(200);
    return;
  }
  const restaurantToStar = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);
  if (!restaurantToStar) {
    console.log(`---------- restaurant ID(${id}) - not found`);
    res.sendStatus(404);
    return;
  }
  console.log(`---------- restaurant ID(${restaurantToStar.id}) - found!!`);
  newId = uuidv4();
  const newStarredRestaurant = {
    id: newId,
    restaurantId: restaurantToStar.id,
  }
  STARRED_RESTAURANTS.push(newStarredRestaurant);

//
const restaurantData = {
  id: newId,
  restaurantId: restaurantToStar.id,
  name: restaurantToStar.name,
}
res.status(200).json(restaurantData);

});


/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
 router.delete("/:id", (req, res) => {
  
  const { id } = req.params;
  console.log(`delete starred rest ID(${id})`);

  // Find the restaurant with the matching id.
  const starredRestFound = STARRED_RESTAURANTS.find((star) => star.id === id);
  console.log(`starredRestFound (${JSON.stringify(starredRestFound)})`);
  if (!starredRestFound) {
    console.log(`---------- starred restaurant ID(${id}) - not found`);
    res.sendStatus(404);
    return;
  }
 
 
  const filteredStarredRests = STARRED_RESTAURANTS.filter(
    (rest) => rest.id !== id
  );
  console.log(`filteredStarredRests (${JSON.stringify(filteredStarredRests)})`);
  STARRED_RESTAURANTS = filteredStarredRests;
  console.log(`---------- starred restaurant ID(${id}) - deleted`);
  res.sendStatus(200);

});
/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
 router.put("/:id", (req, res) => {
  console.log('update starred comment');
  const { id } = req.params;
  const { newComment } = req.body;

  // Find the restaurant with the matching id.
  const starredRestFound = STARRED_RESTAURANTS.find((star) => star.id === id);
  console.log(`starredRestFound (${JSON.stringify(starredRestFound)})`);
  if (!starredRestFound) {
    console.log(`---------- starred restaurant ID(${id}) - not found`);
    res.sendStatus(404);
    return;
  }
  const updatedArray = STARRED_RESTAURANTS.map((star) => 
    star.id === id ? {...star, ...{comment: newComment}} : star);
  
  
  STARRED_RESTAURANTS = updatedArray;
  console.log(`successful update of ${JSON.stringify(STARRED_RESTAURANTS)}`);
  res.sendStatus(200);

});


module.exports = router;
