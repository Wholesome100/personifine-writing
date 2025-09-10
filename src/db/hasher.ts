// A test file to get familiar with bcrypt
import bcrypt from "bcrypt";

const saltRounds = 12;
const myPassword = "bonelesschicken";

bcrypt.hash(myPassword, saltRounds, function (_err, hash) {
  if (hash) {
    console.log(hash);

    bcrypt.compare(myPassword, hash, function (_err, result) {
      console.log(result);
    });
  }
});
