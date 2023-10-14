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
        products: [Product]
        "Reads a product with a specified id"
        product(id: ID!): Product
        "Add a product to the database"
        addProduct(title: String!, imageUrl: String!, amount: Int!, currency: String!): Product
        "Deletes a product and returns its object"
        deleteProduct(id:ID!): Product
    }

   
`;

const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
    product: async (parent, args) =>
      await prisma.product.findUnique({ where: { id: args.id } }),
    addProduct: async (parent, args) =>
      await prisma.product.create({
        data: { ...args, amount: Number(args.amount) },
      }),
    deleteProduct: async (parent, args) =>
      await prisma.product.delete({ where: { id: args.id } }),
  },
};
export { typeDefs, resolvers };
