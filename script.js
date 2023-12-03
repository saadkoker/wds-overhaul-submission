class Note {
    constructor(name) {
        this.name = name;
        this.content = '';
        this.button;
    }
}
class Image {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.button;
    }
}
class Video {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.button;
    }
}
class Folder {

    constructor(name) {
        this.name = name;
        this.files = [];
        this.button;
    }
}
class Directory {
    constructor() {
        this.files = [];
    }
}

let dir = new Directory();
let notes = dir.files;
let buttonIDs = [];
let uniqueIds = [];
let isTextSpoken = false;
let currentNote = new Note("Lol");
let currentID = 0;

document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);
document.addEventListener('DOMContentLoaded', function () {

    var path = window.location.pathname;
    var page = path.split("/").pop();

    var links = document.querySelectorAll('.navBar a');
    links.forEach(function (link) {
        if (link.getAttribute('href') === page) {
            link.classList.add('current');
        }
    });
});

document.addEventListener('keydown', (e) => {

    const msg = new SpeechSynthesisUtterance();

    if (e.key === 'Enter' && window.getSelection().toString() !== '' && !isTextSpoken) {
        let selectedText = window.getSelection().toString();
        let range = window.getSelection().getRangeAt(0);

        let uniqueId = 'highlight_' + Date.now();

        uniqueIds.push(uniqueId);

        let mark = document.createElement('mark');
        mark.className = 'custom-highlight';
        mark.id = uniqueId;

        let wrapper = document.createElement('span');
        wrapper.appendChild(range.extractContents());
        mark.appendChild(wrapper);

        range.insertNode(mark);

        msg.text = selectedText;
        speechSynthesis.speak(msg);

        isTextSpoken = true;

        msg.addEventListener('end', () => {
            uniqueIds.forEach(id => {
                let highlightedElement = document.getElementById(id);
                if (highlightedElement) {
                    highlightedElement.replaceWith(...highlightedElement.childNodes);
                }
            });

            uniqueIds.length = 0;

            isTextSpoken = false;
        });
    }
});

if (window.location.href.includes('filestoring.html')) {
    const addButton = document.getElementById('addButton');
    const radioGroup = document.getElementById('radioGroup');

    radioGroup.addEventListener('change', function (event) {
        radioGroup.style.display = 'none';
        const selectedOption = event.target.value;

        if (selectedOption === 'newFile') {
            addFile();
            var elements = document.getElementsByTagName("input");

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type == "radio") {
                    elements[i].checked = false;
                }
            }

        } else if (selectedOption === 'newFolder') {
            addFolder();
            var elements = document.getElementsByTagName("input");

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type == "radio") {
                    elements[i].checked = false;
                }
            }
        }
    });

    addButton.addEventListener('click', function () {
        radioGroup.style.display = (radioGroup.style.display === 'none' || radioGroup.style.display === '') ? 'block' : 'none';
    });
}

if (window.location.href === 'filestoring.html') {
    window.addEventListener('beforeunload', saveNotes);
}
let foldersSelect = document.getElementById('folders');

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function startSpeechToText() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        if (currentNote) {
            currentNote.content += transcript;
            updateTextareaContent();
        }

        recognition.stop();
    };
}

if (window.location.href.includes('filestoring.html')) {

    const uploadButton = document.querySelector('.upload-btn');
    uploadButton.addEventListener('click', openFileExplorer);


    function openFileExplorer() {
        document.getElementById('file-input').click();
    }

    function handleFileSelection(files) {
        console.log(files);

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

    if (textarea) {
        textarea.addEventListener('input', function () {
            if (currentNote) {
                currentNote.content = textarea.value;
            }
        });
    }
    const ttsButton = document.querySelector('.speakText');
    document.addEventListener('click', function (event) {
        const closestAnchor = event.target.closest('a');

        if (closestAnchor && closestAnchor.querySelector('img.speakText')) {

            console.log('Content of the clicked note:', currentNote.content);

            let selectedText = window.getSelection().toString().trim();

            if (selectedText === '') {
                selectedText = currentNote.content;
            }

            function speakText(text) {
                const speech = new SpeechSynthesisUtterance();
                speech.text = text;

                speechSynthesis.speak(speech);
            }

            speakText(selectedText);
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
        return;
    }
    let newNote = new Note(fileName);
    newNote.button = document.createElement('button');
    notes.push(newNote);

    newNote.button.setAttribute("id", id);
    newNote.button.setAttribute("class", "note");
    newNote.button.textContent = fileName;
    newNote.button.addEventListener('click', () => editTextArea(newNote));

    if (window.location.href.includes('filestoring.html')) {
        loadContentNamesToDiv();
    }

    currentID = currentID + 1;

}
function addFolder() {
    let filebar = document.querySelector('.files');
    let folderName = prompt('Enter a unique name for your new folder:');
    let id = currentID.toString();
    if (!folderName) {
        return;
    }
    let newFolder = new Folder(folderName);
    newFolder.button = document.createElement('button');
    notes.push(newFolder);

    newFolder.button.setAttribute("id", id);
    newFolder.button.setAttribute("class", "folder");
    newFolder.button.textContent = folderName;
    currentID = currentID + 1;

    if (window.location.href.includes('filestoring.html')) {
        loadContentNamesToDiv();
    }
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

    if (window.location.href.includes('notes.html')) {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            notes = JSON.parse(savedNotes);

            rebuildNoteButtons();
        }
    }
}

function rebuildNoteButtons() {

}

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'filestoring.html';
}
function signup(event) {
    event.preventDefault();

    let username = document.querySelector('.register_form input[type="email"]').value;
    let password = document.querySelector('.register_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'filestoring.html';
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
    var newSize = parseFloat(currentSize) * 1.2;
    filesText.style.fontSize = newSize + 'px';
}
function loadContentNamesToDiv() {
    const directoryDisplayDiv = document.querySelector('.directory-display');

    directoryDisplayDiv.innerHTML = '';

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
            img.src = 'assets/file-icon.png';
            let nameToList = document.createElement('span');
            nameToList.textContent = file.name;
            nameToList.setAttribute("class", "listing-span");
            itemDiv.appendChild(img);
            itemDiv.appendChild(nameToList);

            itemDiv.addEventListener('click', () => {
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
                window.location.href = 'imageViewer.html';
                localStorage.setItem('currentNoteContent', file.content);
            });

            directoryDisplayDiv.appendChild(itemDiv);
        }
        else {
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
                window.location.href = 'notes.html';
                localStorage.setItem('currentNoteContent', file.content);
            });
        }
    });
}

