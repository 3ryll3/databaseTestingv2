const modalWrapper = document.querySelector('.modal-wrapper');
const tableUsers = document.querySelector('.table-users');

// modal acc
const accModal = document.querySelector('.acc-modal');
// btn acc
const btnAcc = document.querySelector('.btn-acc');

// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');
// btn add
const btnAdd = document.querySelector('.btn-add');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

// modal info
const infoModal = document.querySelector('.info-modal');
// btn info
const btnInfo = document.querySelector('.btn-info');

// modal deleted
const deletedModal = document.querySelector('.deleted-modal');

let id;

let headerAcc = document.querySelector('.header-acc');
let noteAcc = document.querySelector('.note-acc');

const navbar = document.querySelector('.navbar');







function noAcc() {    
    headerAcc.innerText = `You do not have an account`;
    noteAcc.innerText = `Please sign up to view your account.`;
}
function plusAcc() {
    headerAcc.innerText = `Your Account`;
    noteAcc.innerText = ``;
}

noAcc();


function addAccount() {
    addModal.classList.add('modal-show');

    addModalForm.username.value = '';
    addModalForm.email.value = '';
    addModalForm.phoneNumber.value = '';
}

var addBtnEventHandler = function() { addAccount(); };



btnAdd.addEventListener('click', addBtnEventHandler , true);

// Create element and render users
const renderUser = doc => {
    const tr = `
      <tr data-id='${doc.id}' class="flex-container">
        <td class="user-info"><b>Username</b>
            <text>________</text>
            ${doc.data().username}
        </td>
        <td class="user-info"><b>Email</b>
            <text>_____________</text>
            ${doc.data().email}
        </td>
        <td class="user-info"><b>Phone Number</b>
            <text>___</text>
            ${doc.data().phoneNumber}
        </td>
        <td class="acc-btns">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
        </td>
      </tr>
    `;
    tableUsers.insertAdjacentHTML('beforeend', tr);
    plusAcc();
    // updateCurrentAcc(1)
    btnAdd.removeEventListener('click', addBtnEventHandler , true);
    btnAdd.classList.add('signed-up');
    
    // Click edit user
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener('click', () => {
        editModal.classList.add('modal-show');
        
        id = doc.id;
        editModalForm.username.value = doc.data().username;
        editModalForm.email.value = doc.data().email;
        editModalForm.phoneNumber.value = doc.data().phoneNumber;
    });

    // Click delete user
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        if(confirm("Are you sure you want to delete your account?")){
            db.collection('users').doc(`${doc.id}`).delete().then(() => {
                console.log('Document successfully deleted!');
            }).catch(err => {
                console.log('Error removing document', err);
            });
            accModal.classList.remove('modal-show');
            deletedModal.classList.add('modal-show');
            noAcc();
            // updateCurrentAcc(-1);
            btnAdd.addEventListener('click', addBtnEventHandler , true);
            btnAdd.classList.remove('signed-up');
        }
    });
}



// Click user account button
btnAcc.addEventListener('click', () => {
    accModal.classList.add('modal-show');
});

// Click info button
btnInfo.addEventListener('click', () => {
    infoModal.classList.add('modal-show');
});

// User click anywhere outside the modal
window.addEventListener('click', e => {
    if(e.target === accModal) {
        accModal.classList.remove('modal-show');
    }
    if(e.target === infoModal) {
        infoModal.classList.remove('modal-show');
    }
    if(e.target === deletedModal) {
        deletedModal.classList.remove('modal-show');
    }
    if(e.target === addModal) {
        addModal.classList.remove('modal-show');
    }
    if(e.target === editModal) {
        editModal.classList.remove('modal-show');
    }
});

// Real time listener
db.collection('users').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderUser(change.doc);
        }
        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
        }
        if(change.type === 'modified') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
            renderUser(change.doc);
        }
    });
});

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('users').add({
        username: addModalForm.username.value,
        email: addModalForm.email.value,
        phoneNumber: addModalForm.phoneNumber.value,
    });
    addModal.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('users').doc(id).update({
        username: editModalForm.username.value,
        email: editModalForm.email.value,
        phoneNumber: editModalForm.phoneNumber.value,
    });
    editModal.classList.remove('modal-show');
});


