import { deleteCache, ICacheData } from "@helpers";
import { AuthModel } from "../../model";

export const authLogout = async (authData: ICacheData) => {
  await AuthModel.destroy({
    where: {
      token: authData.token
    }
  })

  await deleteCache(authData.token)
}