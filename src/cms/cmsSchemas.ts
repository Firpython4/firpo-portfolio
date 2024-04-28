import { tcms } from "./tcmsTypes";

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
const collection = tcms.object({
    pt: tcms.markdown("pt"),
    en: tcms.markdown("en")
})