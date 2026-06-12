export type ContactSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  youtubeUrl: string;
  updatedAt?: string;
};

export type PublicContactSettings = {
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  social: {
    facebook: string | null;
    instagram: string | null;
    x: string | null;
    youtube: string | null;
  };
};
