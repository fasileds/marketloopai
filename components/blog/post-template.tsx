import type { BlogTemplate } from "@/lib/validations/blog";

import { CaseStudyTemplate } from "./templates/case-study";
import { CoverGalleryTemplate } from "./templates/cover-gallery";
import { DataInsightsTemplate } from "./templates/data-insights";
import { EditorialTemplate } from "./templates/editorial";
import { MagazineTemplate } from "./templates/magazine";
import { MinimalTemplate } from "./templates/minimal";
import { ModularTemplate } from "./templates/modular";
import type { PostTemplateProps } from "./templates/shared";
import { SplitScreenTemplate } from "./templates/split-screen";
import { VisualStoryTemplate } from "./templates/visual-story";

export type { PostTemplateProps } from "./templates/shared";

export function PostTemplate(props: PostTemplateProps & { template: BlogTemplate }) {
  const { template, ...rest } = props;
  switch (template) {
    case "magazine":
      return <MagazineTemplate {...rest} />;
    case "minimal":
      return <MinimalTemplate {...rest} />;
    case "cover-gallery":
      return <CoverGalleryTemplate {...rest} />;
    case "split-screen":
      return <SplitScreenTemplate {...rest} />;
    case "visual-story":
      return <VisualStoryTemplate {...rest} />;
    case "data-insights":
      return <DataInsightsTemplate {...rest} />;
    case "case-study":
      return <CaseStudyTemplate {...rest} />;
    case "modular":
      return <ModularTemplate {...rest} />;
    case "editorial":
    default:
      return <EditorialTemplate {...rest} />;
  }
}
