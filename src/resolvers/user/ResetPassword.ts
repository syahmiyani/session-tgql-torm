import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";

import { User } from "../../entity/User";

import { resetPasswordPrefix } from "../../constants/redisPrefixes";

import { redis } from "../../utils/redis";
import { sendEmail } from "../../utils/sendEmail";

@Resolver()
export class ResetPasswordResolver {
  @Mutation(() => Boolean)
  async resetPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(resetPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
