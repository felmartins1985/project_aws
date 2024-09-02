import { OrgRoleInterface } from "src/03-model/interface/org-role";

/// é feito um find porque eu posso ter mais de um role em cada usuario
export const roleVerificationFunction = (org: string, userRole: Array<OrgRoleInterface>) => {

  const findRole = userRole.find(
    (index: OrgRoleInterface) => index.org === org,
  );
  return findRole;
};
