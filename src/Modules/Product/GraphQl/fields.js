import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphql } from "graphql"
import { productModel } from "../../../../DB/Models/product.Model.js"
import { productType } from "./type.js"
import { graphQlValidation } from "../../../Middleware/graphqlValidation.middleware.js"
import { updateStockValidation } from "./graphqlValidationSchema.js"
import { checkAuthGraph } from "../../../Middleware/graphqlAuth.middleware.js"
import { Roles } from "../../../Middleware/auth.middleware.js"

export const productss = {
    type: new GraphQLList(productType),
    resolve: async () => {
        let products = await productModel.find().populate([{
            path: "brandId"
        }])
        return products
    }
}


export const updateStock = {
    type: productType,
    args: {
        _id: { type:  GraphQLID},
        productName: { type:  GraphQLString },
        slug: { type:  GraphQLString },
        description: { type:  GraphQLString },
        stock: { type:  GraphQLInt },
        price: { type:  GraphQLInt },
        discount: { type:  GraphQLInt },
        colors: { type: new GraphQLList(GraphQLString) },
        token: {type:  GraphQLString}
    },
    resolve: async (parent, args) => {
        let {_id } = args;
        // Validation
        await graphQlValidation(updateStockValidation, args)
        // authintecation and authrization
        await checkAuthGraph(args.token, [Roles.isAdmin])
        let updateProduct = await productModel.findOneAndUpdate({ _id }, { ...args }, { new: true })
        return updateProduct
    }
}