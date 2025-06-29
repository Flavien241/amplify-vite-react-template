import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'profilePictures',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.authenticated.to(['write']), // l'utilisateur peut uploader
      allow.authenticated.to(['read']),  // l'utilisateur peut voir sa photo
      allow.guest.to(['read']),          // tout le monde peut voir les photos
    ],
  }),
});
