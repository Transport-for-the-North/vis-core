/**
 * utils/imageLoader.js
 * URL-based icon loader for PCA endpoints. It loads icon_url from vector tiles,
 * draws circular framed icons (normal + hover), registers them in MapLibre under
 * icon_name and icon_name-hover, and ensures the two symbol layers exist.
 * Hover is driven by feature-state('hover') set elsewhere in the app.
 */
import Cookies from "js-cookie";

import { api } from "services";

const DEFAULT_ICON_SIZE = 128;

/**
 * Loads an image from a URL and returns an HTMLImageElement.
 * Assumes your image endpoint provides appropriate CORS headers if served cross-origin.
 * @param {string} url - Icon URL (e.g., /AVP/PCA/images/by-point/{id}/32@2x.webp).
 * @returns {Promise<HTMLImageElement>} Loaded image element ready to draw.
 */
const loadHtmlImageFromUrl = (url) =>
  new Promise(async (resolve, reject) => {
    try {
      // Build absolute API-aware URL
      const absoluteUrl = api.baseService.buildAbsoluteUrl(url);

      // Attach JWT from cookie set by AuthProvider
      const token = Cookies.get("token");
      const resp = await fetch(absoluteUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} for ${absoluteUrl}`);
      }

      const blob = await resp.blob();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image blob: ${absoluteUrl}`));
      img.src = URL.createObjectURL(blob);
    } catch (e) {
      reject(e);
    }
  });

/**
 * Draws a circular framed image into a canvas and returns ImageData suitable for map.addImage().
 * @param {HTMLImageElement} img - Loaded image element.
 * @param {number} size - Output canvas size in pixels (default 128).
 * @param {string} frameColor - Frame fill color (e.g., '#ffffff').
 * @returns {ImageData} RGBA pixel data for MapLibre.
 */
const drawCircularFramedImage = (img, size = DEFAULT_ICON_SIZE, frameColor = "#ffffff") => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Outer frame
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = frameColor;
  ctx.fill();

  // Border
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Clip inner circle
  const imageRadius = size / 2 - 4; // leave space for border
  const imageDiameter = imageRadius * 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, imageRadius, 0, Math.PI * 2);
  ctx.clip();

  // Cover-fit the image into the inner circle
  const scale = Math.max(imageDiameter / img.width, imageDiameter / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  const x = (size - scaledWidth) / 2;
  const y = (size - scaledHeight) / 2;
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
};

/**
 * Creates ImageData for a normal circular-framed icon from a URL.
 * @param {string} url - Icon URL.
 * @param {number} size - Canvas size (default 128).
 * @param {string} frameColor - Frame color (default '#ffffff').
 * @returns {Promise<ImageData>} RGBA pixel data.
 */
const createCircularFramedImageFromUrl = async (url, size = DEFAULT_ICON_SIZE, frameColor = "#ffffff") => {
  const img = await loadHtmlImageFromUrl(url);
  return drawCircularFramedImage(img, size, frameColor);
};

/**
 * Creates ImageData for a hover (highlighted) circular-framed icon from a URL.
 * @param {string} url - Icon URL.
 * @param {number} size - Canvas size (default 128).
 * @returns {Promise<ImageData>} RGBA pixel data for hover.
 */
const createHighlightedCircularImageFromUrl = (url, size = DEFAULT_ICON_SIZE) =>
  createCircularFramedImageFromUrl(url, size, "red");

/**
 * Creates ImageData for a hover (highlighted) circular-framed icon from a URL.
 * @param {string} url - Icon URL.
 * @param {number} size - Canvas size (default 128).
 * @returns {Promise<ImageData>} RGBA pixel data for hover.
 */
const createSelectedCircularImageFromUrl = (url, size = DEFAULT_ICON_SIZE) =>
  createCircularFramedImageFromUrl(url, size, "blue");

/**
 * Loads and registers the normal and hover icons for a single feature.
 * Resolves the absolute icon URL using BaseService to avoid hitting the app origin.
 * @param {maplibregl.Map} mapInstance - MapLibre map instance.
 * @param {Object} feature - Vector tile feature with properties { icon_name, icon_url, icon_pixel_ratio }.
 */
export const loadSingleImage = async (mapInstance, feature) => {
  const p = feature.properties || {};
  const iconName = typeof p.icon_name === "string" ? p.icon_name : null;
  const pixelRatio = Number(p.icon_pixel_ratio) || 1;

  if (!iconName || typeof p.icon_url !== "string") {
    console.warn("Feature missing icon_name or icon_url; skipping image load.");
    return;
  }

  const normalId = iconName;
  const hoverId = `${iconName}-hover`;
  const selectedId = `${iconName}-select`;

  if (mapInstance.hasImage(normalId) && mapInstance.hasImage(hoverId) && mapInstance.hasImage(selectedId)) return;

  // Generic, environment-aware absolute URL
  const absoluteUrl = api.baseService.buildAbsoluteUrl(p.icon_url); // BaseService builds the API base correctly

  try {
    const [normalImageData, hoverImageData, selectedImageData] = await Promise.all([
      createCircularFramedImageFromUrl(absoluteUrl, DEFAULT_ICON_SIZE, "#ffffff"),
      createHighlightedCircularImageFromUrl(absoluteUrl, DEFAULT_ICON_SIZE),
      createSelectedCircularImageFromUrl(absoluteUrl, DEFAULT_ICON_SIZE)
    ]);

    if (mapInstance.hasImage(normalId)) mapInstance.removeImage(normalId);
    if (mapInstance.hasImage(hoverId)) mapInstance.removeImage(hoverId);
    if (mapInstance.hasImage(selectedId)) mapInstance.removeImage(selectedId);

    mapInstance.addImage(
      normalId,
      { width: normalImageData.width, height: normalImageData.height, data: normalImageData.data },
      { pixelRatio }
    );
    mapInstance.addImage(
      hoverId,
      { width: hoverImageData.width, height: hoverImageData.height, data: hoverImageData.data },
      { pixelRatio }
    );
     mapInstance.addImage(
      selectedId,
      { width: selectedImageData.width, height: selectedImageData.height, data: selectedImageData.data },
      { pixelRatio }
    );
  } catch (err) {
    console.error(`Failed to load/register icon ${normalId}:`, err);
  }
};

/**
 * Loads images from current tile features for the specified vector source/layer.
 * Deduplicates by icon_name, batches work to avoid blocking, then ensures the
 * two symbol layers (normal and hover) are present. No hover handlers are added here.
 * @param {maplibregl.Map} mapInstance - MapLibre map instance.
 * @param {Object} layer - Layer configuration ({ name, sourceLayer }).
 * @returns {Promise<void>} Resolves when images are loaded and layers ensured.
 */
export const loadImagesFromTileFeatures = async (mapInstance, layer) => {
  const features = mapInstance.querySourceFeatures(layer.name, { sourceLayer: layer.sourceLayer }) || [];

  // Deduplicate by icon_name or fallback to feature id
  const seen = new Set();
  const unique = [];
  for (const f of features) {
    const key = f.properties?.icon_name ?? f.properties?.id;
    if (key != null && !seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }

  // Process in small batches
  const BATCH_SIZE = 10;
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((f) => loadSingleImage(mapInstance, f)));
    await new Promise((r) => setTimeout(r, 0));
  }
};