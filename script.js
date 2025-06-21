// 1. Global variables
let pdfDoc = null;
let currentPage = 1;
let zoom = 1.5;
let allAnnotations = {}; // { pageNum: [annotation1, annotation2, ...] }

// 2. PDF Upload Handling (STEP 5.1)
document.getElementById("pdf-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file.type !== "application/pdf") {
    alert("Only PDF files allowed!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const typedArray = new Uint8Array(this.result);
    pdfjsLib.getDocument(typedArray).promise.then(pdf => {
      pdfDoc = pdf;
      currentPage = 1;
      renderPage(currentPage); // STEP 5.2
    });
  };
  reader.readAsArrayBuffer(file);
});

// 3. Render PDF Page (STEP 5.2)
function renderPage(pageNum) {
  pdfDoc.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: zoom });
    const canvas = document.getElementById("pdf-canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise.then(() => {
      drawAnnotations(pageNum); // show existing annotations (if any)
    });
  });

  // Update page number display (if applicable)
  document.getElementById("page-number").textContent = `${pageNum} / ${pdfDoc.numPages}`;
}

// 4. Save Annotations to localStorage (STEP 7)
document.getElementById("save-btn").addEventListener("click", () => {
  localStorage.setItem("annotations", JSON.stringify(allAnnotations));
  alert("Annotations saved!");
});

// 5. Load Annotations from localStorage (STEP 7)
document.getElementById("load-btn").addEventListener("click", () => {
  const data = localStorage.getItem("annotations");
  if (data) {
    allAnnotations = JSON.parse(data);
    renderPage(currentPage);
    alert("Annotations loaded!");
  } else {
    alert("No saved annotations found.");
  }
});

// 6. Navigation Controls (STEP 8)
document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
});

document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage++;
  renderPage(currentPage);
});

document.getElementById("zoom-in").addEventListener("click", () => {
  zoom += 0.2;
  renderPage(currentPage);
});

document.getElementById("zoom-out").addEventListener("click", () => {
  zoom = Math.max(0.5, zoom - 0.2); // limit to 50%
  renderPage(currentPage);
});

// 7. Placeholder for annotation drawing (you’ll build this)
function drawAnnotations(pageNum) {
  // Use canvas or DOM elements to draw overlays
}

//Draw Annotations Function//
function drawAnnotations(pageNum) {
  const annotations = allAnnotations[pageNum] || [];
  annotations.forEach(annotation => {
    // render based on type
  });
}
//Dark Mode Toggle//

// Dark Mode Toggle
const darkToggle = document.getElementById("dark-mode-toggle");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

//Undo/Redo Annotation Actions//

let undoStack = [];
let redoStack = [];

function saveToUndo() {
  undoStack.push(JSON.stringify(allAnnotations));
  redoStack = []; // clear redo history
}

document.getElementById("undo-btn").addEventListener("click", () => {
  if (undoStack.length === 0) return;
  redoStack.push(JSON.stringify(allAnnotations));
  allAnnotations = JSON.parse(undoStack.pop());
  renderPage(currentPage);
});

document.getElementById("redo-btn").addEventListener("click", () => {
  if (redoStack.length === 0) return;
  undoStack.push(JSON.stringify(allAnnotations));
  allAnnotations = JSON.parse(redoStack.pop());
  renderPage(currentPage);
});
//Recent Files Section//

const fileName = file.name;
let recentFiles = JSON.parse(localStorage.getItem("recentFiles") || "[]");

if (!recentFiles.includes(fileName)) {
  recentFiles.unshift(fileName);
  recentFiles = recentFiles.slice(0, 5); // keep last 5
  localStorage.setItem("recentFiles", JSON.stringify(recentFiles));
}
