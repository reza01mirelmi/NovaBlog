import express, { Application, Request, Response } from "express";
const app: Application = express();
// const Shop = (customer: Customer): void => {
//   const { person, idCustomer, grade, isCustomer } = customer;
//   const { name, famliy, phone, email, age } = person;
//   if (isCustomer) {
//     if (age >= 20) {
//       console.log(
//         `Mster : ${name} with last name : ${famliy} You have a 20% discount.🔥`
//       );
//     } else if (age <= 20 && age >= 10) {
//       console.log(
//         `${name} with last name : ${famliy} You have a 10% discount🦾`
//       );
//     } else {
//       console.log(`${name} You do not have access to discounts.😓`);
//     }
//   } else {
//     console.log(
//       `Dear : ${name}, you are not our customer, the tariff is calculated freely.❌`
//     );
//   }
// };
// Shop({});

const PORT = 7000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app

app.use((req, res) => {
  const err: any = new Error(`Can't find ${req.originalUrl}`);
  err.statuscode = 404;
});

app.listen(PORT, () => {
  console.log("App Is Running ✅");
});
