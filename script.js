class Note {
    constructor(title) {
        this.title = title;
        this.content = '';
        this.button; // Reference to the associated button
    }
}

let notes = [];
let buttonIDs = [];
let currentNote;
let currentID = 0;

document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

function startSpeechToText() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    
    // Configure the recognition settings
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    // Start listening
    recognition.start();
    
    // Handle the recognition result
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        // Insert the transcribed text into the current notes content
        if (currentNote) {
            currentNote.content = transcript;
            updateTextareaContent();
        }
        
        // Stop listening
        recognition.stop();
    };
}

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    let logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }

    const speechToTextButton = document.querySelector('.tts');
    if (speechToTextButton) {
        speechToTextButton.addEventListener('click', startSpeechToText);
    }

    var textarea = document.querySelector('.writing');

    // Check if the textarea element exists
    if (textarea) {
        // Add an 'input' event listener to the textarea
        textarea.addEventListener('input', function() {
            // Get the content of the textarea when it's updated
            if (currentNote) {
                currentNote.content = textarea.value;
            }
        });
    }
    document.addEventListener('click', function(event) {
        // Check if the clicked element has the class "note"
        if (event.target.classList.contains('note')) {
            // Update the 'buttonCurrentlySelected' variable
            buttonCurrentlySelected = event.target;

            // Retrieve the note associated with the clicked button
            currentNote = notes[parseInt(buttonCurrentlySelected.getAttribute("id"))];
            console.log('Content of the clicked note:', currentNote.content);


            // Update the textarea content with the note content
            let writingTextarea = document.querySelector('.writing');
            writingTextarea.value = currentNote.content;
        }
    });
}
function editTextArea(noteToReplace) {
    // Save the content of the current textarea to the current note
    if (currentNote) {
        currentNote.content = document.querySelector('.writing').value;
    }

    // Set the current note to the one being edited
    currentNote = noteToReplace;

    // Update the textarea with the content of the note being edited
    let writingTextarea = document.querySelector('.writing');
    writingTextarea.value = currentNote.content;
}
function updateTextareaContent() {
    let writingTextarea = document.querySelector('.writing');
    writingTextarea.value = currentNote.content;
}

function addFile() {
    let filebar = document.querySelector('.files');
    let id = currentID.toString();

    let fileName = prompt('Enter a unique name for your new file:');
    if (!fileName) {
        // If the user cancels the prompt, return early
        return;
    }
    let newNote = new Note(fileName);
    newNote.button = document.createElement('button');
    notes.push(newNote);

    newNote.button.setAttribute("id", id);
    newNote.button.setAttribute("class", "note");
    newNote.button.textContent = fileName;
    newNote.button.addEventListener('click', () => editTextArea(newNote));
    filebar.appendChild(newNote.button);
    currentID = currentID + 1;
    // Clear the content of the textarea and set the current note to the new note
    let writingTextarea = document.querySelector('.writing');
    writingTextarea.value = '';  // Clear the textarea
    currentNote = newNote;
}

function startSpeechToTextForNewNote(newNote) {
    currentNote = newNote;
    startSpeechToText();
}

function checkPage() {
    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'notes.html';
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'login.html';
}