import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type * as ImagePicker from 'expo-image-picker';

/** Downscale to max 1024px on the longest side at JPEG quality 0.7, as base64. */
export async function toDownscaledDataUrl(
  asset: ImagePicker.ImagePickerAsset,
): Promise<string> {
  const context = ImageManipulator.manipulate(asset.uri);
  const longest = Math.max(asset.width ?? 0, asset.height ?? 0);

  if (longest > 1024 && asset.width && asset.height) {
    const scale = 1024 / longest;
    context.resize({
      width: Math.round(asset.width * scale),
      height: Math.round(asset.height * scale),
    });
  }

  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.7,
    base64: true,
  });

  return `data:image/jpeg;base64,${result.base64 ?? ''}`;
}
