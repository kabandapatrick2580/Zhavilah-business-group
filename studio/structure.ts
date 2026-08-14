import type { StructureResolver } from "sanity/structure";

/**
 * Orders the Studio sidebar so it reads the way an editor thinks about the
 * site, rather than alphabetically by schema name. Site settings is pinned as a
 * singleton — there is only ever one of it, so it opens straight into the
 * document instead of an empty list with a "create" button.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("post").title("Blog posts"),
      S.documentTypeListItem("banner").title("Homepage banners"),
      S.documentTypeListItem("galleryImage").title("Gallery"),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("trainingModule").title("Training modules"),
      S.documentTypeListItem("page").title("Website pages"),
    ]);
