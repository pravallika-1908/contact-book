let contacts = JSON.parse(localStorage.getItem("contacts")) || {};

let editingContact = null;

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const categoryInput = document.getElementById("category");
const searchInput = document.getElementById("searchInput");

const contactsContainer = document.getElementById("contactsContainer");
const contactCount = document.getElementById("contactCount");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");

const message = document.getElementById("message");


function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}


function showMessage(text) {
    message.textContent = text;
    message.classList.add("show");

    setTimeout(() => {
        message.classList.remove("show");
    }, 2500);
}


function addContact(name, phone, email, category) {

    let existingName = Object.keys(contacts).find(
        contactName => contactName.toLowerCase() === name.toLowerCase()
    );

    if (existingName) {

        let overwrite = confirm(
            "Contact already exists. Do you want to overwrite it?"
        );

        if (!overwrite) {
            return;
        }

        delete contacts[existingName];
    }

    contacts[name] = {
        phone: phone,
        email: email,
        category: category
    };

    saveContacts();

    showMessage("Contact added successfully!");

    displayContacts();

    contactForm.reset();
}


function updateContact(oldName, newName, phone, email, category) {

    if (oldName !== newName) {

        let duplicate = Object.keys(contacts).find(
            contactName =>
                contactName.toLowerCase() === newName.toLowerCase()
                && contactName !== oldName
        );

        if (duplicate) {
            showMessage("Another contact with this name already exists.");
            return;
        }
    }

    delete contacts[oldName];

    contacts[newName] = {
        phone: phone,
        email: email,
        category: category
    };

    saveContacts();

    showMessage("Contact updated successfully!");

    cancelEdit();

    displayContacts();
}


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const category = categoryInput.value;

    if (name === "" || phone === "" || email === "") {
        showMessage("Please fill all fields.");
        return;
    }

    if (editingContact !== null) {

        updateContact(
            editingContact,
            name,
            phone,
            email,
            category
        );

    } else {

        addContact(
            name,
            phone,
            email,
            category
        );
    }
});


function displayContacts(searchTerm = "") {

    contactsContainer.innerHTML = "";

    const contactNames = Object.keys(contacts);

    contactCount.textContent =
        `${contactNames.length} Contact${contactNames.length !== 1 ? "s" : ""}`;

    const filteredContacts = contactNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredContacts.length === 0) {

        contactsContainer.innerHTML = `
            <div class="empty-message">
                <h3>No contacts found</h3>
                <p>Try another search or add a new contact.</p>
            </div>
        `;

        return;
    }

    filteredContacts.forEach(name => {

        const details = contacts[name];

        const card = document.createElement("div");

        card.className = "contact-card";

        card.innerHTML = `
            <h3>👤 ${name}</h3>

            <div class="contact-info">
                📞 ${details.phone}
            </div>

            <div class="contact-info">
                📧 ${details.email}
            </div>

            <span class="category">
                ${details.category}
            </span>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editContact('${escapeName(name)}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteContact('${escapeName(name)}')"
                >
                    Delete
                </button>

            </div>
        `;

        contactsContainer.appendChild(card);
    });
}


function escapeName(name) {
    return name.replace(/'/g, "\\'");
}


function editContact(name) {

    const details = contacts[name];

    if (!details) {
        showMessage("Contact does not exist.");
        return;
    }

    editingContact = name;

    nameInput.value = name;
    phoneInput.value = details.phone;
    emailInput.value = details.email;
    categoryInput.value = details.category;

    formTitle.textContent = "Update Contact";
    submitBtn.textContent = "Update Contact";

    cancelBtn.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function cancelEdit() {

    editingContact = null;

    contactForm.reset();

    formTitle.textContent = "Add Contact";
    submitBtn.textContent = "Add Contact";

    cancelBtn.style.display = "none";
}


function deleteContact(name) {

    if (!contacts[name]) {
        showMessage("Contact does not exist.");
        return;
    }

    const details = contacts[name];

    const confirmation = confirm(
        `Are you sure you want to delete ${name}?\n\n` +
        `Phone: ${details.phone}\n` +
        `Email: ${details.email}`
    );

    if (!confirmation) {
        return;
    }

    delete contacts[name];

    saveContacts();

    showMessage("Contact deleted successfully!");

    displayContacts();
}


searchInput.addEventListener("input", function() {

    const searchTerm = searchInput.value.trim();

    displayContacts(searchTerm);
});


displayContacts();
