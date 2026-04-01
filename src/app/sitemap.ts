import { getCollectionsStaticPaths } from "../collection";
import getUrl from "../url";

export const dynamic = "force-static";

const sitemap = async () => {
  const paths = await getCollectionsStaticPaths();
  return paths.map((paramSet) => {
    return {
      url: `${getUrl()}/${paramSet.locale}/${paramSet.collection}`,
      lastModified: new Date().toISOString(),
      priority: 0.5,
    };
  });
};

export default sitemap;
