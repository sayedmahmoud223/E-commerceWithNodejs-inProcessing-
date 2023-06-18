import {GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";


export const brandType = new GraphQLObjectType({
    name: "brandInfo",
    description:"",
    fields: {
        _id:{type: GraphQLID},
        brandName: { type: GraphQLString },
        brandImage: {
            type: new GraphQLObjectType({
                name: "brandImage",
                fields: {
                    public_id: { type: GraphQLString },
                    secure_url: { type: GraphQLString },
                }
            })
        },
    }
})


export let productType = new GraphQLObjectType({
    name: "allProducts",
    description: "all product using graphQl",
    fields: {
        productName: { type: GraphQLString },
        slug: { type: GraphQLString },
        description: { type: GraphQLString },
        stock: { type: GraphQLInt },
        price: { type: GraphQLInt },
        discount: {type: GraphQLInt},
        colors: {type: new GraphQLList(GraphQLString)},
        brandId: { type: brandType },
        mainImage: {type: new GraphQLObjectType({
            name:"image",
            fields:{
                public_id: { type: GraphQLString },
                secure_url: { type: GraphQLString },
            }
        })},
    }
})