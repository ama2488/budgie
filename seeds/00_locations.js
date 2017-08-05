exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('receipts').del().then(knex('locations').del().then(() =>
  // Inserts seed entries
  knex('locations').insert([
    {
      location: 'Trader Joes',
    }, {
      location: 'Whole Foods',
    }, {
      location: 'HEB',
    }, {
      location: 'Starbucks',
    },
  ])));
};
