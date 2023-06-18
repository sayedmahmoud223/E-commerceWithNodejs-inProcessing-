import { GraphQLObjectType, GraphQLSchema, GraphQLString, graphql } from "graphql"
import {productss,updateStock} from "./fields.js"


export const productSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"product",
        description:"",
        fields:{
            productss
        }

    }),
    mutation: new GraphQLObjectType({
        name:"updateStock",
        description:"",
        fields: {
            updateStock
        }
    })

})