import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";

import { isAuth } from "../../middleware/isAuth";

import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { RegisterInput } from "../../inputsAndValidation";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => [User])
  async getAllRegisteredUsers() {
    return User.find();
  }

  @Mutation(() => User)
  async register(
    @Arg("data")
    { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationUrl(newUser.id));

    return newUser;
  }
}
