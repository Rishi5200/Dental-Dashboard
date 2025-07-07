export const fileToBase64 = (file: File): Promise<{name:string,url:string}> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res({ name: file.name, url: reader.result as string });
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
