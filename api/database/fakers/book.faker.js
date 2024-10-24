const { faker } = require("@faker-js/faker");
const moment = require("moment");

const generate = async (adminIds, total = 30) => {
  let Books = [];
  for (let bookNo = 0; bookNo < total; bookNo++) {
    Books.push({
      title: faker.lorem.words(3),
      isbn: faker.commerce.isbn(13),
      genre: faker.helpers.arrayElement([
        "Fantasy",
        "History",
        "Comics",
        "Novels",
        "Fiction",
      ]),
      language: faker.helpers.arrayElement(["English", "Hindi", "Punjabi"]),
      author: faker.person.fullName(),
      publisher: faker.company.name(),
      publicationYear: moment(
        faker.date.between({
          from: "2000-01-01T00:00:00Z",
          to: "2024-01-01T00:00:00Z",
        })
      ).year(),
      pages: faker.number.int({ min: 47, max: 210 }),
      copies: faker.number.int({ min: 5, max: 20 }),

      // Admin ids
      user: faker.helpers.arrayElement(adminIds),
    });
  }
  return Books;
};

module.exports = generate;
