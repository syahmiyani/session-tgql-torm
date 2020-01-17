import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../typesAndInterfaces/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
