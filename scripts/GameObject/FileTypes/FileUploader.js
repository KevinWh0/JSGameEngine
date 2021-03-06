export function getDataUrl(img) {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
}

//.let file = document.getElementById("fileinput").files[0];
export async function readImage(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    //console.log(reader.result);
    callback(reader.result);
  };

  //return reader.readAsDataURL(file);
}

export async function readFile(file, callback) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    //console.log(reader.result);
    callback(reader.result);
  };

  //return reader.readAsDataURL(file);
}
