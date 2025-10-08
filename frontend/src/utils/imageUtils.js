import { BASE_URL } from '../config';

export const getImageUrl = (imageUrl) => {
     if (!imageUrl) return null;

     // If it's already a full URL, return as is
     if (imageUrl.startsWith('http')) {
          return imageUrl;
     }

     // If it starts with /, prepend BASE_URL
     if (imageUrl.startsWith('/')) {
          return `${BASE_URL}${imageUrl}`;
     }

     // Otherwise, assume it's a filename and prepend the product images path
     return `${BASE_URL}/product-images/${imageUrl}`;
};

export const getProfileImageUrl = (imageUrl) => {
     if (!imageUrl) return null;

     // If it's already a full URL, return as is
     if (imageUrl.startsWith('http')) {
          return imageUrl;
     }

     // If it starts with /, prepend BASE_URL
     if (imageUrl.startsWith('/')) {
          return `${BASE_URL}${imageUrl}`;
     }

     // Otherwise, assume it's a filename and prepend the profile pictures path
     return `${BASE_URL}/profile-pictures/${imageUrl}`;
};
