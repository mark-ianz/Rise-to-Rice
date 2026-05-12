export type ImgurUpload = {
  status: number;
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    vote: null;
    favorite: boolean;
    nsfw: null;
    section: null;
    account_url: null;
    account_id: number;
    is_ad: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    tags: any[];
    ad_type: number;
    ad_url: string;
    edited: string;
    in_gallery: boolean;
    deletehash: string;
    name: string;
    link: string;
  };
}