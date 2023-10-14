import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = `#graphql
    type Product{
        id: ID!
        title: String
        imageUrl: String
        amount: Int
        currency: String
    }
    type Query{
      "Returns a list of all products found in the database"
        products: [Product]
        "Reads a product with a specified id"
        product(id: ID!): Product
        
    }

    type AddProductResponse{
      success: Boolean,
      product: Product
    }
    type DeleteProductResponse{
      success: Boolean,
      product: Product
    }

    type Mutation{
        "Add a product to the database"
        addProduct(title: String!, imageUrl: String!, amount: Int!, currency: String!): AddProductResponse
        "Deletes a product and returns its object"
        deleteProduct(id:ID!): DeleteProductResponse
    }
   
`;

const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
    product: async (parent, args) =>
      await prisma.product.findUnique({ where: { id: args.id } }),
  },
  Mutation: {
    addProduct: async (parent, args) => {
      const product = await prisma.product.create({
        data: { ...args, amount: Number(args.amount) },
      });
      return {
        success: 200,
        product
      }
    },
    deleteProduct: async (parent, args) => {
      const product = await prisma.product.delete({ where: { id: args.id } });
      return {
        success: 200,
        product
      }
    },
  },
};
export { typeDefs, resolvers };
