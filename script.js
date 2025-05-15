// Обновлённая адаптированная версия с полным drag'n'drop под тач и мышь
const container = document.getElementById("puzzle-container");
const sizeSelector = document.getElementById("size");
const imageInput = document.getElementById("imageUpload");
const shuffleButton = document.getElementById("shuffle");

let imageSrc = "default.png";
let size = parseInt(sizeSelector.value);
let pieces = [];

sizeSelector.addEventListener("change", () => {
    size = parseInt(sizeSelector.value);
    createPuzzle();
});

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader(); reader.onload = function (evt) {
            imageSrc = evt.target.result;
            createPuzzle();
        };
        reader.readAsDataURL(file);
    }
});

shuffleButton.addEventListener("click", () => {
    pieces = shuffleArray(pieces); drawPuzzle();
});

function createPuzzle() {
    container.innerHTML = ""; pieces = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            pieces.push({
                x, y
            });
        }
    }

    pieces = shuffleArray(pieces); drawPuzzle();
}

function drawPuzzle() {
    const containerSize = container.clientWidth; const pieceSize = containerSize / size; container.style.height = $ {
        containerSize
    }px; container.innerHTML = "";

    pieces.forEach((piece, index) => {
        const div = document.createElement("div"); div.classList.add("puzzle-piece"); div.style.width = $ {
            pieceSize
        }px; div.style.height = $ {
            pieceSize
        }px;

        div.style.left = `${(index % size) * pieceSize}px`;
        div.style.top = `${Math.floor(index / size) * pieceSize}px`;

        div.style.backgroundImage = `url(${imageSrc})`;
        div.style.backgroundSize = `${size * 100}% ${size * 100}%`;
        div.style.backgroundPosition = `-${piece.x * 100}% -${piece.y * 100}%`;

        // Drag and touch events
        div.draggable = true;
        div.dataset.index = index;

        div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
        });

        div.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        div.addEventListener("drop", (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData("text"));
            swapPieces(fromIndex, index);
        });

        // Touch events
        let touchStartX = 0, touchStartY = 0;
        div.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            div.classList.add("dragging");
        });

        div.addEventListener("touchend", (e) => {
            div.classList.remove("dragging");
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

            const fromIndex = parseInt(div.dataset.index);
            let toIndex = fromIndex;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && (fromIndex % size) < size - 1) toIndex = fromIndex + 1;
                else if (dx < 0 && (fromIndex % size) > 0) toIndex = fromIndex - 1;
            } else {
                if (dy > 0 && fromIndex + size < size * size) toIndex = fromIndex + size;
                else if (dy < 0 && fromIndex - size >= 0) toIndex = fromIndex - size;
            }

            swapPieces(fromIndex, toIndex);
        });

        container.appendChild(div);

    });
}

function swapPieces(i, j) {
    if (i === j) return; [pieces[i],
        pieces[j]] = [pieces[j],
        pieces[i]]; drawPuzzle();
}

function shuffleArray(array) {
    const shuffled = array.slice(); for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); [shuffled[i],
            shuffled[j]] = [shuffled[j],
            shuffled[i]];
    } return shuffled;
}

// Инициализация createPuzzle();