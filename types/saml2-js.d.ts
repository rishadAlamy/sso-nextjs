declare module "saml2-js" {
  export class ServiceProvider {
    constructor(options: any);
    create_login_request_url(
      idp: any,
      options: any,
      cb: (err: any, loginUrl: any) => void
    ): void;
    post_assert(
      idp: any,
      options: any,
      cb: (err: any, samlResponse: any) => void
    ): void;
  }
  export class IdentityProvider {
    constructor(options: any);
  }
  export const SAML: {
    ServiceProvider: typeof ServiceProvider;
    IdentityProvider: typeof IdentityProvider;
  };
}
