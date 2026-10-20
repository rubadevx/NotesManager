
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const saveButton = document.getElementById("saveButton");

// Load previously saved notes.
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Remember which note is being edited.
let editingId = null;

// Save notes in the browser.
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Display all notes on the page.
function displayNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.textContent = "No notes yet. Add your first note!";
    return;
  }

  notes.forEach(function(note) {
    const card = document.createElement("div");
    card.className = "note";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = note.content;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit";

    editButton.addEventListener("click", function() {
      titleInput.value = note.title;
      contentInput.value = note.content;
      editingId = note.id;
      saveButton.textContent = "Update Note";
      titleInput.focus();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    deleteButton.addEventListener("click", function() {
      notes = notes.filter(function(item) {
        return item.id !== note.id;
      });

      saveNotes();
      displayNotes();
    });

    actions.append(editButton, deleteButton);
    card.append(heading, paragraph, actions);
    notesList.appendChild(card);
  });
}

// Add a new note or update an existing one.
noteForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    return;
  }

  if (editingId !== null) {
    notes = notes.map(function(note) {
      if (note.id === editingId) {
        return { ...note, title: title, content: content };
      }

      return note;
    });

    editingId = null;
    saveButton.textContent = "Add Note";
  } else {
    const newNote = {
      id: Date.now(),
      title: title,
      content: content
    };

    notes.push(newNote);
  }

  saveNotes();
  displayNotes();
  noteForm.reset();
});

// Show saved notes when the app opens.
displayNotes();
