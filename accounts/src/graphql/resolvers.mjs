const accounts = [
  {
    id: "1",
    email: "marked@mandiwise.com",
  },
];

const resolvers = {
  Account: {
    __resolveReference(reference) {
      return accounts.find((account) => account.id === reference.id);
    },
  },
  Query: {
    viewer(parent, args, { user }) {
      // console.log("RESOLVER: USER: ", user);
      return accounts[0];
    },
  },
};

export default resolvers;
