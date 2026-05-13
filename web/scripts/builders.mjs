import { loadEvent } from "./event.mjs";
import { loadProjectMetadataSnapshot, mergeBuilderWithProjectMetadata, metadataRecordMap } from "./project-metadata.mjs";
import { loadBaseBuilders } from "./registry.mjs";

function cleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeBuilderLinks(builder) {
  const github = cleanString(builder.github);
  const githubProfileUrl = github ? `https://github.com/${github}` : null;
  const githubAvatarUrl = github
    ? `https://avatars.githubusercontent.com/${github}?s=80`
    : null;
  const displayName = cleanString(builder.name) || github || builder.id;
  const builderPageUrl = cleanString(builder.id)
    ? `/builders/${builder.id}/`
    : null;

  return {
    ...builder,
    githubProfileUrl,
    githubAvatarUrl,
    displayName,
    builderPageUrl,
  };
}

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
  }).map(normalizeBuilderLinks);
}
