// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        firstName: string;
        lastName: string;
        ennisId: string;
        hiredAt: string;
        title: string;
        email: string;
        extension: string;
        username: string;
        password?: string;
        roles: string[];
        isActive: boolean;
        redirectSignIn: string;
        navigation: {
          [key: string]: {
            name: string;
            route: string;
          }[];
        };
      };
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
