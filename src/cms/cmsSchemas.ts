import { type Infer, tcms } from "./tcmsTypes";

const videoWithThumbnail = tcms.object({
    url: tcms.url(), thumbnail: tcms.image()
});

const abc = tcms.url();

type TestA = Infer<typeof abc>;

const video = tcms.union(
    tcms.url(),
    videoWithThumbnail
)

const piece = tcms.union(
    tcms.image(),
    video
);

const pieces = tcms.array(piece);
export const collection = pieces;