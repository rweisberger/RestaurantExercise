var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, assertDirective } = require('graphql');

var restaurants = [
    {
        name: "WoodsHill",
        description: "American cuisine, farm to table, with fresh produce every day",
        dishes: [
        {
            name: "Swordfish grill",
            price: 27
        },
        {
            name: "Roasted Broccily",
            price: 11
        }
        ]
    },
    {
        name: "Fiorellas",
        description: "Italian-American home cooked food with fresh pasta and sauces",
        "dishes": [
        {
            name: "Flatbread",
            price: 14
        },
        {
            name: "Carbonara",
            price: 18
        },
        {
            name: "Spaghetti",
            price: 19
        }
        ]
    },
    {
        name: "Karma",
        description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
        dishes: [
        {
            name: "Dragon Roll",
            price: 12
        },
        {
            name: "Pancake roll",
            price: 11
        },
        {
            name: "Cod cakes",
            price: 13
        }
        ]
    }
    ]
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    restaurant(name: String): Restaurant
    restaurants: [Restaurant]
  },
  type Restaurant {
      name: String
      description: String
      dishes: [Dish]
  },
  type Dish{
      name: String
      price: Int
  },
  input RestaurantInput{
    name: String
    description: String
    dishes: [DishInput]
  },
  input DishInput{
    name: String
    price: Int
  },
  type DeleteResponse{
    ok: Boolean!
  },
  type Mutation{
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(name: String!): DeleteResponse
    editRestaurant(name: String!, description: String!): Restaurant
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (arg) => restaurants.find(element => element.name === arg.name),

  restaurants: () => restaurants,

  setRestaurant: ({ input }) => {
    // Your code goes here
    restaurants.push({name:input.name, description:input.description, dishes:input.dishes})
    return input
  },

  deleteRestaurant: ({ name }) => {
    // Your code goes here
    const ok = Boolean(restaurants.find(element => element.name === name))
    let removed = restaurants.filter(element => element.name === name)
    console.log(JSON.stringify(removed));
    restaurants = restaurants.filter(element => element.name !== name);
    return {ok}
  },

  editRestaurant: ({ name, ...restaurant }) => {
    // Your code goes here
    console.log(JSON.stringify({...restaurant}));
    let match = restaurants.find(element => element.name === name);
    if(match === undefined) {
        throw new Error("restaurant does not exist")
      } else {
        match = {...match, ...restaurant}
        restaurants = restaurants.filter(element => element.name !== name);
        restaurants.push(match);
      }
      return match
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(5000,()=>console.log('Running graphql on port 5000'));