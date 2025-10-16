import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity-client";

// https://www.sanity.io/docs/image-url

const imageService = {
  urlFor: (source: SanityImageSource): string => {
    const builder = imageUrlBuilder(client);

    return builder.image(source).quality(85).format("png").url();
  },
};

export default imageService;
