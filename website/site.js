var portraits = document.querySelectorAll(".portrait img");

function showPhotoNote(img) {
  if (img.hidden) {
    return;
  }
  var note = document.createElement("p");
  note.className = "portrait-note";
  note.textContent = "Photo to be added";
  img.hidden = true;
  if (img.parentElement) {
    img.parentElement.appendChild(note);
  }
}

portraits.forEach(function (img) {
  img.addEventListener("error", function () {
    showPhotoNote(img);
  });
  if (img.complete && img.naturalWidth === 0) {
    showPhotoNote(img);
  }
});
