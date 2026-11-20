const UNKNOWN_BUILD_VALUE = "unknown";
const BUILD_INFO_HEADER = "vis-core build information";
const VIS_CORE_REPOSITORY_URL = "https://github.com/Transport-for-the-North/vis-core";

const readBuildValue = (value) => {
  const normalised = String(value ?? "").trim();
  return normalised || UNKNOWN_BUILD_VALUE;
};

export const getVisCoreBuildInfo = () => {
  const env = import.meta?.env ?? {};
  const version = readBuildValue(env.VITE_VIS_CORE_VERSION);
  const commitHash = readBuildValue(env.VITE_VIS_CORE_COMMIT_HASH);

  return {
    version,
    commitHash,
  };
};

export const formatVisCoreBuildInfoForFooter = () => {
  const { version } = getVisCoreBuildInfo();
  return `Built with TfN vis-core ${version}`;
};

export const appendVisCoreBuildInfoToTechnicalDetails = (technicalDetails) => {
  const { version, commitHash } = getVisCoreBuildInfo();
  const existingDetails = String(technicalDetails ?? "").trim();
  const buildDetails = [
    BUILD_INFO_HEADER,
    `version: ${version}`,
    `commit hash: ${commitHash}`,
  ].join("\n");

  if (!existingDetails) {
    return buildDetails;
  }

  return `${existingDetails}\n\n${buildDetails}`;
};

export const getVisCoreSourceUrl = () => {
  return VIS_CORE_REPOSITORY_URL;
};
