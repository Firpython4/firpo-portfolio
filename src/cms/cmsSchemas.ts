import { safePath } from "./fileManagement";
import { type Infer, tcms } from "./tcmsTypes";

const videoWithThumbnail = tcms.object({
    url: tcms.url(), thumbnail: tcms.image()
});

const video = tcms.union(
    tcms.url(),
    videoWithThumbnail
)

const piece = tcms.union(
    tcms.image(),
    video
);

const pieces = tcms.array(piece);

export const collection = tcms.object({
    pieces,
    pt: tcms.markdown("pt"),
    en: tcms.markdown("en")
});

type CollectionType = Infer<typeof collection>;

const parsed = await collection.parse(safePath("collections/internacional"));

if (parsed.wasResultSuccessful)
{
}