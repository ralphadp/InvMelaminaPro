const delUserBtn = document.querySelectorAll('.delUserBtn');

for(let i = 0; i < delUserBtn.length; i++) {
    delUserBtn[i].addEventListener('click', delUser);
};

function delUser() {
    fetch('/kickass/' + this.id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (response.ok) {
            console.log(response.status);
            window.location.reload();//update page
        }
    })
    .catch(error => {
        console.log( error.message);
    });
};