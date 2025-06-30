import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "profilePictures",
  access: (allow) => ({
    "profile-pictures/{entity_id}/*": [
      allow.authenticated.to(["read", "write"]), // utilisateurs authentifiés peuvent lire et écrire
      allow.guest.to(["read"]), // invités peuvent seulement lire
    ],
  }),
});
