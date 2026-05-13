export const checkResolution = (file: File): Promise<{ width: number; height: number }> => {
  return createImageBitmap(file).then((bitmap) => {
    const { width, height } = bitmap;
    bitmap.close(); // free memory
    return { width, height };
  });
};