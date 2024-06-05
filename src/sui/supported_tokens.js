import { ITEM_CATEGORY } from '../items.js'

export const AFSUI =
  '0x02264251ff808fbf55c06f60fd1174814fd787bd32dc539531894deb497029c7::afsui::AFSUI'

export const SUPPORTED_TOKENS = {
  [AFSUI]: {
    item_category: ITEM_CATEGORY.RESOURCE,
    item_set: 'none',
    item_type: AFSUI,
    decimal: 9,
    image_url: 'https://strapi-dev.scand.app/uploads/FUD_Logo_46c0468f49.jpg', // temp
    is_token: true,
    name: 'AfSui',
    level: 1,
  },
}
