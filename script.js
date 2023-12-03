class Note {
    constructor(name) {
        this.name = name;
        this.content = '';
        this.button; // Reference to the associated button
    }
}
class Image {
    constructor(name ,path) {
        this.name = name;
        this.path = path;
        this.button; // Reference to the associated button
    }
}
class Video {
    constructor(name ,path) {
        this.name = name;
        this.path = path;
        this.button; // Reference to the associated button
    }
}
class Folder {

    constructor(name){
        this.name = name;
        this.files = [];
        this.button;
    }
}
class Directory {
    constructor(){
        this.files = [];
    }
}

let dir = new Directory();
let notes = dir.files;
let buttonIDs = [];
let currentNote = new Note("Lol");
let currentID = 0;

document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

if(window.location.href.includes('filestoring.html')) {
    const addButton = document.getElementById('addButton');
    const radioGroup = document.getElementById('radioGroup');

        // Add event listener for changes in the radio button selection
        radioGroup.addEventListener('change', function (event) {
            // Hide the radio button group when an option is selected
            radioGroup.style.display = 'none';
            const selectedOption = event.target.value;

            if (selectedOption === 'newFile') {
                addFile();
                // Add your file-specific logic here
            } else if (selectedOption === 'newFolder') {
                addFolder();
                var elements = document.getElementsByTagName("input");

                for (var i = 0; i < elements.length; i++) {
                        if (elements[i].type == "radio") {
                            elements[i].checked = false;
                        }
                    }
                // Add your folder-specific logic here
            }
        });

        addButton.addEventListener('click', function () {
            // Toggle the display of the radio button group
            radioGroup.style.display = (radioGroup.style.display === 'none' || radioGroup.style.display === '') ? 'block' : 'none';
        });
}

if(window.location.href === 'filestoring.html') {
    // Add event listener for beforeunload
    window.addEventListener('beforeunload', saveNotes);
}
let foldersSelect = document.getElementById('folders');

function saveNotes() {
    // Save notes to localStorage before leaving the page
    localStorage.setItem('notes', JSON.stringify(notes));
}

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
        
        // Append the transcribed text to the current notes content
        if (currentNote) {
            currentNote.content += transcript;  // Use += to append
            updateTextareaContent();
        }
        
        // Stop listening
        recognition.stop();
    };
}
const uploadButton = document.querySelector('.upload-btn');
uploadButton.addEventListener('click', openFileExplorer);

      
function openFileExplorer() {
document.getElementById('file-input').click();
}

function handleFileSelection(files) {
console.log(files);

// For example, display the file names
for (let i = 0; i < files.length; i++) {
    const newImg = new Image(files[i].name, files[i].name);
    newImg.button = document.createElement('button');
    newImg.button.setAttribute("id", currentID.toString());
    newImg.button.setAttribute("class", "note");
    currentID = currentID + 1;
    dir.files.push(newImg);
}
loadContentNamesToDiv()
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

    const speechToTextButton = document.querySelector('#tts');
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

            console.log('Content of the clicked note:', currentNote.content);

            let selectedText = window.getSelection().toString().trim();

            if (selectedText === '') {
                selectedText = currentNote.content
            }

            function speakText(text) {
                const speech = new SpeechSynthesisUtterance();
                speech.text = text;
            
                speechSynthesis.speak(speech);
              }
            speakText(selectedText)
        }
    });
}
function editTextArea(noteToReplace) {

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

    if(window.location.href.includes('filestoring.html')){
        loadContentNamesToDiv();
    }
    
    currentID = currentID + 1;

    /*
    // Clear the content of the textarea and set the current note to the new note
    let writingTextarea = document.querySelector('.writing');
    writingTextarea.value = '';  // Clear the textarea
    currentNote = newNote;
    */
}
function addFolder() {
    let filebar = document.querySelector('.files');
    let folderName = prompt('Enter a unique name for your new folder:');
    let id = currentID.toString();
    if (!folderName) {
        // If the user cancels the prompt, return early
        return;
    }
    let newFolder = new Folder(folderName);
    newFolder.button = document.createElement('button');
    notes.push(newFolder);

    newFolder.button.setAttribute("id", id);
    newFolder.button.setAttribute("class", "folder");
    newFolder.button.textContent = folderName;
    currentID = currentID + 1;

    if(window.location.href.includes('filestoring.html')){
        loadContentNamesToDiv();
    }
    // Clear the content of the textarea and set the current note to the new note
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

    // Load notes from localStorage on page load
    if (window.location.href.includes('notes.html')) {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            notes = JSON.parse(savedNotes);

            // Rebuild the note buttons in the UI
            rebuildNoteButtons();
        }
    }
}

// Add a function to rebuild note buttons in the UI
function rebuildNoteButtons() {
    const filebar = document.querySelector('.files');
    filebar.innerHTML = ''; // Clear existing buttons

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const id = i.toString();

        note.button = document.createElement('button');
        note.button.setAttribute("id", id);
        note.button.setAttribute("class", "note");
        note.button.textContent = note.name;
        note.button.addEventListener('click', () => editTextArea(note));
        filebar.appendChild(note.button);
    }
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

function zoomText() {
    var filesText = document.getElementById('filesText');
    var currentSize = window.getComputedStyle(filesText).fontSize;
    var newSize = parseFloat(currentSize) * 1.2; // Increase font size by 20%
    filesText.style.fontSize = newSize + 'px';
}
function loadContentNamesToDiv() {
    const directoryDisplayDiv = document.querySelector('.directory-display');

    // Clear the existing content in the div
    directoryDisplayDiv.innerHTML = '';

    // Iterate through the files in dir
    dir.files.forEach(file => {
        
        let itemDiv = document.createElement('div');
        itemDiv.setAttribute("class", "listing");
        itemDiv.setAttribute("id", file.button.getAttribute("id"));

        if (file.constructor.name === 'Note' || file.constructor.name === 'Video') {
            let itemDiv = document.createElement('div');
            itemDiv.setAttribute("class", "listing");
            itemDiv.setAttribute("id", file.button.getAttribute("id"));
            let img = document.createElement('img');
            img.setAttribute("class", "file-img");
            img.src ='assets/file-icon.png';
            let nameToList = document.createElement('span');
            nameToList.textContent = file.name;
            nameToList.setAttribute("class", "listing-span");
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameToList);

            itemDiv.addEventListener('click', () => {
                // Navigate to note.html and load the content of the clicked note
                window.location.href = 'notes.html';
                localStorage.setItem('currentNoteContent', file.content);
            });

            directoryDisplayDiv.appendChild(itemDiv);
        }
        else if (file.constructor.name === 'Image') {
            let itemDiv = document.createElement('div');
            itemDiv.setAttribute("class", "listing");
            itemDiv.setAttribute("id", file.button.getAttribute("id"));
            let img = document.createElement('img');
            img.setAttribute("class", "file-img");
            let filePath = 'assets/';
            filePath.concat(file.path);
            img.src = filePath + file.path;
            let nameToList = document.createElement('span');
            nameToList.textContent = file.name;
            nameToList.setAttribute("class", "listing-span");
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameToList);

            itemDiv.addEventListener('click', () => {
                // Navigate to note.html and load the content of the clicked note
                window.location.href = 'imageViewer.html';
                localStorage.setItem('currentNoteContent', file.content);
            });

            directoryDisplayDiv.appendChild(itemDiv);
        }
        else{
            let itemDiv = document.createElement('div');
            itemDiv.setAttribute("class", "listing");
            itemDiv.setAttribute("id", file.button.getAttribute("id"));
            let img = document.createElement('img');
            img.setAttribute("class", "file-img");
            img.src = 'assets/folder-icon.png';
            let nameToList = document.createElement('span');
            nameToList.textContent = file.name;
            nameToList.setAttribute("class", "listing-span");
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameToList);

            directoryDisplayDiv.appendChild(itemDiv);
            
        }
        if (file.constructor.name === 'Note') {
            itemDiv.addEventListener('click', () => {
                // Navigate to note.html and load the content of the clicked note
                window.location.href = 'notes.html';
                localStorage.setItem('currentNoteContent', file.content);
            });
        }
        directoryDisplayDiv.appendChild(itemDiv);
    });
    if(window.location.href === 'notes.html') {
        document.addEventListener('DOMContentLoaded', function () {
            const textArea = document.getElementById('textArea');
        
            // Function to handle right-click context menu
            function handleContextMenu(event) {
            event.preventDefault();
        
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                speakText(selectedText);
            }
            }
        
            // Function to speak the selected text using Web Speech API
            function speakText(text) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
        
            speechSynthesis.speak(speech);
            }
        
            // Attach context menu event listener to the text area
            textArea.addEventListener('contextmenu', handleContextMenu);
        });
    }
        
}

