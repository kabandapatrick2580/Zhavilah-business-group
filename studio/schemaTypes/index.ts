import { banner } from "./banner";
import { blockContent } from "./blockContent";
import { galleryImage } from "./galleryImage";
import { intake } from "./intake";
import { page } from "./page";
import { post } from "./post";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { trainingModule } from "./trainingModule";

// The eight document types covering §2.2 of the agreement, plus the shared
// rich-text object.
export const schemaTypes = [
  post,
  service,
  trainingModule,
  intake,
  galleryImage,
  banner,
  page,
  siteSettings,
  blockContent,
];
