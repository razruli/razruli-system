import React from "react";

import { UsersDocument } from "@/shared/graphql";
import { PreloadQuery } from "@/shared/lib/apollo-client/apolloClient";

type UserLayoutProps = {
  children: React.ReactNode;
};

const UserPageLayout = ({ children }: UserLayoutProps) => {
  return (
    <PreloadQuery
      query={UsersDocument}
      variables={{ input: { limit: 10, offset: 0 } }}
    >
      {children}
    </PreloadQuery>
  );
};

export default UserPageLayout;
