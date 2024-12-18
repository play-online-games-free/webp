const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const previewImage = document.getElementById("preview-image");
const downloadLink = document.getElementById("download-link");

let convertedImageBlob = null;

// Drag-and-drop events
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("hover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("hover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("hover");
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
});

// File upload event
dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) processFile(file);
});

// Paste event
document.addEventListener("paste", (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) processFile(file);
        }
    }
});

// Process the uploaded or pasted file
function processFile(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (PNG or JPG).");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convert to WebP and create a blob
            canvas.toBlob(
                (blob) => {
                    convertedImageBlob = blob;
                    const blobUrl = URL.createObjectURL(blob);

                    // Show the preview and set download link
                    preview.style.display = "block";
                    previewImage.src = blobUrl;

                    // Update the download link
                    downloadLink.href = blobUrl;
                    downloadLink.download = "converted.webp";
                },
                "image/webp",
                0.8 // Quality
            );
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
}

// Trigger download when the preview image is clicked
previewImage.addEventListener("click", () => {
    if (convertedImageBlob) {
        downloadLink.click();
    }
});
