/**
 * Saves `contents` to the user's computer as `filename` without leaving the
 * page, by clicking a temporary link to an in-memory blob.
 */
export const downloadFile = (
  contents: string,
  filename: string,
  type: string
) => {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
