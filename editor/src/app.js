let history = [];

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            updateCanvas(img, true);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('applyFilter').addEventListener('click', function() {
    const filter = document.getElementById('filterSelect').value;
    applyFilterToImage(filter);
});

document.getElementById('undo').addEventListener('click', function() {
    if (history.length > 1) {
        history.pop();
        const ctx = document.getElementById('canvas').getContext('2d');
        const lastImage = history[history.length - 1];
        ctx.putImageData(lastImage, 0, 0);
    }
});

function updateCanvas(image, clearHistory = false) {
    const canvas = document.getElementById('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (clearHistory) {
        history = [];
    }
    saveHistory();
}

function applyFilterToImage(filter) {
    saveHistory();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (filter === 'grayscale') {
            const grayscale = 0.3 * red + 0.59 * green + 0.11 * blue;
            data[i] = grayscale;
            data[i + 1] = grayscale;
            data[i + 2] = grayscale;
        } else if (filter === 'sepia') {
            data[i] = red * 0.393 + green * 0.769 + blue * 0.189;
            data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168;
            data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function saveHistory() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.push(imageData);
}
