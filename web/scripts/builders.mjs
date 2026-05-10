import { loadEvent } from "./event.mjs";
import { loadProjectMetadataSnapshot, mergeBuilderWithProjectMetadata, metadataRecordMap } from "./project-metadata.mjs";
import { loadBaseBuilders } from "./registry.mjs";

export function loadBuilders() {
  const event = loadEvent();
  const builders = loadBaseBuilders();
  const metadataById = metadataRecordMap(loadProjectMetadataSnapshot());

  return builders.map((builder) => {
    const merged = mergeBuilderWithProjectMetadata(
      builder,
      metadataById.get(builder.id) || null
    );

    return {
      ...merged,
      firstUpdateWeekEnd: merged.firstUpdateWeekEnd || event.defaultBuilderWeek1End || null,
    };
  });
}
